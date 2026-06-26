import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async book(userId: string, dto: CreateBookingDto) {
    const cls = await this.prisma.class.findFirst({
      where: { id: dto.class_id, deleted_at: null },
    });
    if (!cls) throw new NotFoundException("Class not found");

    const activeBookings = await this.prisma.booking.count({
      where: { class_id: dto.class_id, status: "BOOKED" },
    });

    if (activeBookings >= cls.max_seats) {
      throw new BadRequestException("Class is fully booked");
    }

    const existing = await this.prisma.booking.findUnique({
      where: { user_id_class_id: { user_id: userId, class_id: dto.class_id } },
    });

    if (existing) {
      if (existing.status === "BOOKED") {
        throw new ConflictException("You have already booked this class");
      }
      return this.prisma.booking.update({
        where: { id: existing.id },
        data: { status: "BOOKED" },
        include: { class: { include: { program: true, professional: true } } },
      });
    }

    const myBookings = await this.prisma.booking.findMany({
      where: { user_id: userId, status: "BOOKED" },
      include: { class: true },
    });

    const hasConflict = myBookings.some((booking) => {
      const bookedClass = booking.class;

      // start time and end time are in format HH:MM, so we need to convert them to Date objects for comparison
      const [bookedStartHour, bookedStartMinute] = bookedClass.start_time
        .split(":")
        .map(Number);
      const [bookedEndHour, bookedEndMinute] = bookedClass.end_time
        .split(":")
        .map(Number);
      const [clsStartHour, clsStartMinute] = cls.start_time
        .split(":")
        .map(Number);
      const [clsEndHour, clsEndMinute] = cls.end_time.split(":").map(Number);

      // Now compare the times
      // bookedStartHour < clsEndHour || (bookedStartHour === clsEndHour && bookedStartMinute < clsEndMinute)
      // bookedEndHour > clsStartHour || (bookedEndHour === clsStartHour && bookedEndMinute > clsStartMinute)
      const bookedStartTime = new Date(
        bookedClass.date.getFullYear(),
        bookedClass.date.getMonth(),
        bookedClass.date.getDate(),
        bookedStartHour,
        bookedStartMinute,
      );
      const bookedEndTime = new Date(
        bookedClass.date.getFullYear(),
        bookedClass.date.getMonth(),
        bookedClass.date.getDate(),
        bookedEndHour,
        bookedEndMinute,
      );
      const clsStartTime = new Date(
        cls.date.getFullYear(),
        cls.date.getMonth(),
        cls.date.getDate(),
        clsStartHour,
        clsStartMinute,
      );
      const clsEndTime = new Date(
        cls.date.getFullYear(),
        cls.date.getMonth(),
        cls.date.getDate(),
        clsEndHour,
        clsEndMinute,
      );

      return (
        bookedClass.date.getTime() === cls.date.getTime() &&
        bookedStartTime < clsEndTime &&
        bookedEndTime > clsStartTime
      );
    });

    if (hasConflict) {
      throw new ConflictException(
        "You have another booking that conflicts with this class",
      );
    }

    return this.prisma.booking.create({
      data: { user_id: userId, class_id: dto.class_id },
      include: { class: { include: { program: true, professional: true } } },
    });
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, user_id: userId },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.status === "CANCELLED") {
      throw new BadRequestException("Booking is already cancelled");
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  }

  getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { user_id: userId },
      include: {
        class: {
          include: {
            program: { select: { id: true, title: true, category: true } },
            professional: {
              select: { id: true, first_name: true, last_name: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  getAllBookings(classId?: string) {
    return this.prisma.booking.findMany({
      where: classId ? { class_id: classId } : undefined,
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        class: { select: { id: true, title: true, date: true } },
      },
      orderBy: { created_at: "desc" },
    });
  }
}

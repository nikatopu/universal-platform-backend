import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateClassDto) {
    return this.prisma.class.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
      include: { professional: true, program: true },
    });
  }

  findAll(companyId?: string, date?: string) {
    return this.prisma.class.findMany({
      where: {
        deleted_at: null,
        ...(companyId ? { company_id: companyId } : {}),
        ...(date ? { date: new Date(date) } : {}),
      },
      include: {
        professional: {
          select: { id: true, first_name: true, last_name: true },
        },
        program: { select: { id: true, title: true, category: true } },
        _count: { select: { bookings: { where: { status: "BOOKED" } } } },
      },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });
  }

  async findOne(id: string) {
    const cls = await this.prisma.class.findFirst({
      where: { id, deleted_at: null },
      include: {
        professional: true,
        program: true,
        _count: { select: { bookings: { where: { status: "BOOKED" } } } },
      },
    });
    if (!cls) throw new NotFoundException("Class not found");
    return cls;
  }

  async update(id: string, dto: UpdateClassDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.class.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.class.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: "Class deleted" };
  }
}

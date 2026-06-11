import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { AssignMembershipDto } from "./dto/assign-membership.dto";

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMembershipDto) {
    return this.prisma.membership.create({ data: dto });
  }

  findAll(companyId?: string) {
    return this.prisma.membership.findMany({
      where: {
        deleted_at: null,
        ...(companyId ? { company_id: companyId } : {}),
      },
      orderBy: { price: "asc" },
    });
  }

  async findOne(id: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { id, deleted_at: null },
    });
    if (!membership) throw new NotFoundException("Membership not found");
    return membership;
  }

  async update(id: string, dto: UpdateMembershipDto) {
    await this.findOne(id);
    return this.prisma.membership.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.membership.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: "Membership deleted" };
  }

  async assignToUser(membershipId: string, dto: AssignMembershipDto) {
    await this.findOne(membershipId);
    return this.prisma.userMembership.create({
      data: {
        user_id: dto.user_id,
        membership_id: membershipId,
        start_date: new Date(dto.start_date),
        end_date: new Date(dto.end_date),
      },
      include: { membership: true },
    });
  }

  getMyMembership(userId: string) {
    return this.prisma.userMembership.findMany({
      where: { user_id: userId, status: "ACTIVE" },
      include: { membership: true },
      orderBy: { end_date: "desc" },
    });
  }

  getUserMemberships(userId: string) {
    return this.prisma.userMembership.findMany({
      where: { user_id: userId },
      include: { membership: true },
      orderBy: { end_date: "desc" },
    });
  }
}

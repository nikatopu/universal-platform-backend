import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProfessionalDto) {
    return this.prisma.professional.create({ data: dto });
  }

  findAll(companyId?: string) {
    return this.prisma.professional.findMany({
      where: {
        deleted_at: null,
        active: true,
        ...(companyId ? { company_id: companyId } : {}),
      },
      orderBy: { first_name: "asc" },
    });
  }

  async findOne(id: string) {
    const professional = await this.prisma.professional.findFirst({
      where: { id, deleted_at: null },
    });
    if (!professional) throw new NotFoundException("Professional not found");
    return professional;
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    await this.findOne(id);
    return this.prisma.professional.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.professional.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: "Professional deleted" };
  }
}

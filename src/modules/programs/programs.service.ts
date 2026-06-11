import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProgramDto) {
    return this.prisma.program.create({ data: dto });
  }

  findAll(companyId?: string, category?: string) {
    return this.prisma.program.findMany({
      where: {
        deleted_at: null,
        ...(companyId ? { company_id: companyId } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { title: "asc" },
    });
  }

  async findOne(id: string) {
    const program = await this.prisma.program.findFirst({
      where: { id, deleted_at: null },
    });
    if (!program) throw new NotFoundException("Program not found");
    return program;
  }

  async update(id: string, dto: UpdateProgramDto) {
    await this.findOne(id);
    return this.prisma.program.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.program.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: "Program deleted" };
  }
}

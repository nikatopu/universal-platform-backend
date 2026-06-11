import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  getByCompany(companyId: string) {
    return this.prisma.settings.findUnique({
      where: { company_id: companyId },
    });
  }

  upsert(companyId: string, dto: UpdateSettingsDto) {
    return this.prisma.settings.upsert({
      where: { company_id: companyId },
      update: dto,
      create: { company_id: companyId, ...dto },
    });
  }
}

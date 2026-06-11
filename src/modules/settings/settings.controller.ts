import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':companyId')
  @ApiOperation({ summary: 'Get settings for a company (public)' })
  getByCompany(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return this.settingsService.getByCompany(companyId);
  }

  @Patch(':companyId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update company settings (admin)' })
  upsert(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.settingsService.upsert(companyId, dto);
  }
}

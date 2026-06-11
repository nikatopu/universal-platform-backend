import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { GymStatus } from '@prisma/client';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ enum: GymStatus })
  @IsOptional()
  @IsEnum(GymStatus)
  gym_status?: GymStatus;

  @ApiPropertyOptional({ example: 'Studio closed for cleaning on Sunday mornings.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  announcement?: string;
}

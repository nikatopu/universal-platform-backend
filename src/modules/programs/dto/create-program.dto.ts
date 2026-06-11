import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from "class-validator";

export class CreateProgramDto {
  @ApiProperty({ example: "uuid-of-company" })
  @IsUUID()
  company_id: string;

  @ApiProperty({ example: "Morning Yoga Flow" })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    example: "A gentle morning yoga session to start your day.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: "Yoga" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ example: 60 })
  @IsInt()
  @Min(5)
  duration_minutes: number;
}

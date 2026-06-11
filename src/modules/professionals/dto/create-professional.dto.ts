import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateProfessionalDto {
  @ApiProperty({ example: "uuid-of-company" })
  @IsUUID()
  company_id: string;

  @ApiProperty({ example: "Alex" })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  first_name: string;

  @ApiProperty({ example: "Johnson" })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  last_name: string;

  @ApiPropertyOptional({ example: "Yoga & Pilates" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialization?: string;

  @ApiPropertyOptional({
    example: "Certified yoga instructor with 10 years of experience.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ example: "https://cdn.example.com/alex.jpg" })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

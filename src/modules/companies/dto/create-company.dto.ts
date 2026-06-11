import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({ example: "fitreserve" })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  project_id: string;

  @ApiProperty({ example: "FitReserve Studio Downtown" })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: "contact@fitreserve.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+1-555-0100" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

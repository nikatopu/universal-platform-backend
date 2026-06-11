import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  MaxLength,
} from "class-validator";

export class CreateMembershipDto {
  @ApiProperty({ example: "uuid-of-company" })
  @IsUUID()
  company_id: string;

  @ApiProperty({ example: "Monthly Unlimited" })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    example: "Unlimited access to all classes for 30 days.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 79.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}

import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsInt,
  IsDateString,
  Matches,
  Min,
  MaxLength,
} from "class-validator";

export class CreateClassDto {
  @ApiProperty({ example: "uuid-of-company" })
  @IsUUID()
  company_id: string;

  @ApiProperty({ example: "uuid-of-professional" })
  @IsUUID()
  professional_id: string;

  @ApiProperty({ example: "uuid-of-program" })
  @IsUUID()
  program_id: string;

  @ApiProperty({ example: "Morning Yoga — Beginner" })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: "2024-07-15" })
  @IsDateString()
  date: string;

  @ApiProperty({ example: "09:00" })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "start_time must be in HH:MM format" })
  start_time: string;

  @ApiProperty({ example: "10:00" })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "end_time must be in HH:MM format" })
  end_time: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  max_seats: number;
}

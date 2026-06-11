import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({ example: "uuid-of-class" })
  @IsUUID()
  class_id: string;
}

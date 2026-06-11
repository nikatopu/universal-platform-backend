import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsDateString } from "class-validator";

export class AssignMembershipDto {
  @ApiProperty({ example: "uuid-of-user" })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: "2024-06-01" })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: "2024-07-01" })
  @IsDateString()
  end_date: string;
}

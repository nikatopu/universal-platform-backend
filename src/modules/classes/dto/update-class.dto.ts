import { PartialType, OmitType } from "@nestjs/swagger";
import { CreateClassDto } from "./create-class.dto";

export class UpdateClassDto extends PartialType(
  OmitType(CreateClassDto, ["company_id"] as const),
) {}

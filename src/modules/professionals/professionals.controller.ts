import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ProfessionalsService } from "./professionals.service";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@ApiTags("Professionals")
@Controller("professionals")
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a professional (admin)" })
  create(@Body() dto: CreateProfessionalDto) {
    return this.professionalsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List professionals" })
  @ApiQuery({ name: "companyId", required: false })
  findAll(@Query("companyId") companyId?: string) {
    return this.professionalsService.findAll(companyId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a professional by ID" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.professionalsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update a professional (admin)" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfessionalDto,
  ) {
    return this.professionalsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Soft-delete a professional (admin)" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.professionalsService.remove(id);
  }
}

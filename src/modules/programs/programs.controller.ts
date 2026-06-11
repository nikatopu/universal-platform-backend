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
import { ProgramsService } from "./programs.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@ApiTags("Programs")
@Controller("programs")
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a program (admin)" })
  create(@Body() dto: CreateProgramDto) {
    return this.programsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List programs" })
  @ApiQuery({ name: "companyId", required: false })
  @ApiQuery({ name: "category", required: false })
  findAll(
    @Query("companyId") companyId?: string,
    @Query("category") category?: string,
  ) {
    return this.programsService.findAll(companyId, category);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a program by ID" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.programsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update a program (admin)" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.programsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Soft-delete a program (admin)" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.programsService.remove(id);
  }
}

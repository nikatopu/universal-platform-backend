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
import { ClassesService } from "./classes.service";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@ApiTags("Classes")
@Controller("classes")
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a class (admin)" })
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get class schedule" })
  @ApiQuery({ name: "companyId", required: false })
  @ApiQuery({
    name: "date",
    required: false,
    description: "Filter by date (YYYY-MM-DD)",
  })
  findAll(
    @Query("companyId") companyId?: string,
    @Query("date") date?: string,
  ) {
    return this.classesService.findAll(companyId, date);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a class by ID" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update a class (admin)" })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Soft-delete a class (admin)" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.classesService.remove(id);
  }
}

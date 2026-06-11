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
import { MembershipsService } from "./memberships.service";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { AssignMembershipDto } from "./dto/assign-membership.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";

@ApiTags("Memberships")
@Controller("memberships")
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a membership plan (admin)" })
  create(@Body() dto: CreateMembershipDto) {
    return this.membershipsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List membership plans" })
  @ApiQuery({ name: "companyId", required: false })
  findAll(@Query("companyId") companyId?: string) {
    return this.membershipsService.findAll(companyId);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get my active memberships" })
  getMyMembership(@CurrentUser() user: { id: string }) {
    return this.membershipsService.getMyMembership(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a membership plan by ID" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.membershipsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update a membership plan (admin)" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Soft-delete a membership plan (admin)" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.membershipsService.remove(id);
  }

  @Post(":id/assign")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Assign a membership plan to a user (admin)" })
  assign(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AssignMembershipDto,
  ) {
    return this.membershipsService.assignToUser(id, dto);
  }
}

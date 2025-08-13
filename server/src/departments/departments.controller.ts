import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './department.entity';
import { OrganizationAuthGuard } from 'src/auth/guards/organization-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CurrentUserWithOrg } from 'src/auth/decorators/current-user-with-org.decorator';
import { DepartmentCreateDto } from './dto/department.create.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ClerkAuthGuard } from 'src/auth/guards/clerk-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) { }

  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a department' })
  @ApiResponse({ status: 201, description: 'Department created', type: Department })
  create(@Body() body: DepartmentCreateDto, @CurrentUserWithOrg() user: AuthenticatedUser): Promise<Department> {
    return this.departmentService.create(body, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  @ApiResponse({ status: 200, type: [Department] })
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Department })
  findOne(@Param('id') id: number) {
    return this.departmentService.findOne(id);
  }

  @Get("/organization/:id")
  @ApiOperation({ summary: 'Get a department by organization ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Department })
  findOrganization(@Param('id') id: string) {
    return this.departmentService.findOrganization(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Department })
  update(@Param('id') id: number, @Body() body: Partial<Department>) {
    return this.departmentService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Department deleted' })
  remove(@Param('id') id: number, @CurrentUserWithOrg() user: AuthenticatedUser) {
    return this.departmentService.remove(id, user);
  }

  @Delete("/organization/:orgId")
  @Roles(RolesEnum.ADMIN)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete entire organization from departments' })
  @ApiParam({ name: 'orgId', type: String })
  @ApiResponse({ status: 200, description: 'Organization departments deleted' })
  deleteOrganization(@Param('orgId') orgId: string, @CurrentUserWithOrg() user: AuthenticatedUser) {
    if (user.organizationId !== orgId) {
      throw new ForbiddenException('You are not authorized to delete this organization');
    }
    return this.departmentService.deleteOrganization(orgId);
  }
}

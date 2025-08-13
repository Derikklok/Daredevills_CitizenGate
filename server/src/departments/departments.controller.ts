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

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) { }

  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post()
  create(@Body() body: DepartmentCreateDto, @CurrentUserWithOrg() user: AuthenticatedUser): Promise<Department> {
    return this.departmentService.create(body, user);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.departmentService.findOne(id);
  }

  @Get("/organization/:id")
  findOrganization(@Param('id') id: string) {
    return this.departmentService.findOrganization(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Department>) {
    return this.departmentService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  remove(@Param('id') id: number, @CurrentUserWithOrg() user: AuthenticatedUser) {
    return this.departmentService.remove(id, user);
  }

  @Delete("/organization/:orgId")
  @Roles(RolesEnum.ADMIN)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  deleteOrganization(@Param('orgId') orgId: string, @CurrentUserWithOrg() user: AuthenticatedUser) {
    if (user.organizationId !== orgId) {
      throw new ForbiddenException('You are not authorized to delete this organization');
    }
    return this.departmentService.deleteOrganization(orgId);
  }
}

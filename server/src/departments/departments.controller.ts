import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './department.entity';
import { OrganizationAuthGuard } from 'src/auth/guards/organization-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CurrentUserWithOrg } from 'src/auth/decorators/current-user-with-org.decorator';
import { DepartmentCreateDto } from './dto/department.create.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) { }

  @UseGuards(OrganizationAuthGuard)
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
  remove(@Param('id') id: number) {
    return this.departmentService.remove(id);
  }
}

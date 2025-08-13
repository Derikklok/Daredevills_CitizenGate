import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './department.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Post()
  create(@Body() body: Partial<Department>){
    return this.departmentService.create(body);
  }

  @Get()
  findAll(){
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.departmentService.findOne(id);
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

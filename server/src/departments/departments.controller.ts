import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentReadDto } from './dto/department.read.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) { }

  @Get()
  async findAll(): Promise<DepartmentReadDto[]> {
    return await this.departmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DepartmentReadDto> {
    if (!id) {
      throw new BadRequestException('Department ID is required');
    }
    try {
      return await this.departmentService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Department not found');
    }
  }
}

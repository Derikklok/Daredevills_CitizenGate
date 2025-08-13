import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { GovernmentServicesService } from './government-services.service';
import { GovernmentService } from './government-service.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGovernmentServiceDto } from './dto/create-government-service.dto';
import { UpdateGovernmentServiceDto } from './dto/update-government-service.dto';

@ApiTags('Government Services')
@ApiBearerAuth()
@Controller('government-services')
export class GovernmentServicesController {
  constructor(private readonly governmentServicesService: GovernmentServicesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a government service' })
  @ApiResponse({ status: 201, type: GovernmentService })
  create(@Body() body: CreateGovernmentServiceDto) {
    return this.governmentServicesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all government services or filter by department' })
  @ApiQuery({ name: 'department_id', required: false, type: String })
  @ApiResponse({ status: 200, type: [GovernmentService] })
  findAll(@Query('department_id') departmentId?: string) {
    if (departmentId) {
      return this.governmentServicesService.findByDepartment(parseInt(departmentId, 10));
    }
    return this.governmentServicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a government service by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: GovernmentService })
  findOne(@Param('id') id: string) {
    return this.governmentServicesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a government service' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: GovernmentService })
  update(@Param('id') id: string, @Body() body: UpdateGovernmentServiceDto) {
    return this.governmentServicesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a government service' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Service deleted' })
  remove(@Param('id') id: string) {
    return this.governmentServicesService.remove(id);
  }
}

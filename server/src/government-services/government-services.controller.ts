import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { GovernmentServicesService } from './government-services.service';
import { GovernmentService } from './government-service.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGovernmentServiceDto } from './dto/create-government-service.dto';
import { UpdateGovernmentServiceDto } from './dto/update-government-service.dto';
import { FilterGovernmentServicesDto } from './dto/filter-government-services.dto';

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
  @ApiOperation({ summary: 'List all government services or filter by department and/or name' })
  @ApiResponse({ status: 200, type: [GovernmentService] })
  findAll(@Query() filter: FilterGovernmentServicesDto) {
    const { department_id, name } = filter;
    
    if (department_id) {
      return this.governmentServicesService.findByDepartment(department_id, name);
    }
    return this.governmentServicesService.findAll(name);
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

import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GovernmentServicesService } from './government-services.service';
import { GovernmentService } from './government-service.entity';

@Controller('government-services')
export class GovernmentServicesController {
  constructor(private readonly governmentServicesService: GovernmentServicesService) {}

  @Post()
  create(@Body() body: Partial<GovernmentService>) {
    return this.governmentServicesService.create(body);
  }

  @Get()
  findAll() {
    return this.governmentServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.governmentServicesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<GovernmentService>) {
    return this.governmentServicesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.governmentServicesService.remove(id);
  }
}

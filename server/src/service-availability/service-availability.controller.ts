import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ServiceAvailabilityService } from './service-availability.service';
import { ServiceAvailability } from './service-availability.entity';

@Controller('service-availability')
export class ServiceAvailabilityController {
  constructor(private readonly availabilityService: ServiceAvailabilityService) {}

  @Post()
  create(@Body() body: Partial<ServiceAvailability> | (Omit<Partial<ServiceAvailability>, 'day_of_week'> & { days_of_week: string[] })) {
    return this.availabilityService.create(body);
  }

  @Post('batch')
  createBatch(@Body() bodies: Partial<ServiceAvailability>[]) {
    return this.availabilityService.createBatch(bodies);
  }

  @Post('multiple-days')
  createForMultipleDays(
    @Body() data: Omit<Partial<ServiceAvailability>, 'day_of_week'> & { days_of_week: string[] }
  ) {
    return this.availabilityService.createForMultipleDays(data);
  }

  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.availabilityService.findByService(serviceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<ServiceAvailability>) {
    return this.availabilityService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }
}

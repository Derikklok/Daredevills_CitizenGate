import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ServiceAvailabilityService } from './service-availability.service';
import { ServiceAvailability } from './service-availability.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateServiceAvailabilityDto, CreateServiceAvailabilityMultipleDaysDto } from './dto/create-service-availability.dto';
import { UpdateServiceAvailabilityDto } from './dto/update-service-availability.dto';

@ApiTags('Service Availability')
@ApiBearerAuth()
@Controller('service-availability')
export class ServiceAvailabilityController {
  constructor(private readonly availabilityService: ServiceAvailabilityService) { }

  @Post()
  @ApiOperation({ summary: 'Create a service availability entry or multiple days' })
  @ApiResponse({ status: 201, type: ServiceAvailability, isArray: false })
  create(@Body() body: CreateServiceAvailabilityDto | CreateServiceAvailabilityMultipleDaysDto) {
    return this.availabilityService.create(body);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create multiple availability entries' })
  @ApiResponse({ status: 201, type: [ServiceAvailability] })
  createBatch(@Body() bodies: CreateServiceAvailabilityDto[]) {
    return this.availabilityService.createBatch(bodies);
  }

  @Post('multiple-days')
  @ApiOperation({ summary: 'Create availability entries for multiple days' })
  @ApiResponse({ status: 201, type: [ServiceAvailability] })
  createForMultipleDays(
    @Body() data: CreateServiceAvailabilityMultipleDaysDto
  ) {
    return this.availabilityService.createForMultipleDays(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all availability' })
  @ApiResponse({ status: 200, type: [ServiceAvailability] })
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Find all availability for a service' })
  @ApiParam({ name: 'serviceId', type: String })
  @ApiResponse({ status: 200, type: [ServiceAvailability] })
  findByService(@Param('serviceId') serviceId: string) {
    return this.availabilityService.findByService(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get availability by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ServiceAvailability })
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update availability' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ServiceAvailability })
  update(@Param('id') id: string, @Body() body: UpdateServiceAvailabilityDto) {
    return this.availabilityService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete availability' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Availability deleted' })
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }
}

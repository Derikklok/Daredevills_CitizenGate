import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() body: Partial<Appointment>) {
    return this.appointmentsService.create(body);
  }

  @Get()
  findAll(
    @Query('department_id') departmentId?: number,
    @Query('service_id') serviceId?: string,
    @Query('nic') nic?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const filters = {
      department_id: departmentId,
      service_id: serviceId,
      nic,
      status,
      date
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    return this.appointmentsService.findAll(filters);
  }

  @Get('by-nic/:nic')
  findByNIC(@Param('nic') nic: string) {
    return this.appointmentsService.findByNIC(nic);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Appointment>) {
    return this.appointmentsService.update(id, body);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}

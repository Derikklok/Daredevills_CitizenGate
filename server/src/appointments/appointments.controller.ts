import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { FilterAppointmentsDto } from './dto/filter-appointments.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Create a new appointment with optional document submissions
   * 
   * @example Request body
   * {
   *   "service_id": "uuid-of-service",
   *   "availability_id": "uuid-of-availability",
   *   "full_name": "John Doe",
   *   "nic": "123456789V",
   *   "phone_number": "+94 77 123 4567",
   *   "address": "123 Main St",
   *   "birth_date": "1990-01-01",
   *   "gender": "Male",
   *   "email": "john@example.com",
   *   "appointment_time": "2025-08-15T10:30:00Z",
   *   "notes": "First-time application",
   *   "documents_submitted": [
   *     {
   *       "document_id": "uuid-of-required-document",
   *       "name": "Passport",
   *       "file_url": "https://storage.example.com/documents/passport.pdf"
   *     },
   *     {
   *       "document_id": "uuid-of-another-document",
   *       "name": "Birth Certificate",
   *       "file_url": "https://storage.example.com/documents/birth-cert.jpg"
   *     }
   *   ]
   * }
   */
  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  create(@Body() body: CreateAppointmentDto) {
    return this.appointmentsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Find all appointments with optional filters' })
  findAll(@Query() filter: FilterAppointmentsDto) {
    const filters = {
      department_id: filter.department_id,
      service_id: filter.service_id,
      nic: filter.nic,
      username: filter.username,
      status: filter.status,
      date: filter.date
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    return this.appointmentsService.findAll(filters);
  }

  @Get('by-nic/:nic')
  @ApiOperation({ summary: 'Find appointments by NIC' })
  @ApiParam({ name: 'nic', type: String, description: 'National ID Card number' })
  findByNIC(@Param('nic') nic: string) {
    return this.appointmentsService.findByNIC(nic);
  }
  
  @Get('by-username/:username')
  @ApiOperation({ summary: 'Find appointments by username' })
  @ApiParam({ name: 'username', type: String, description: 'Username of the appointment creator' })
  findByUsername(@Param('username') username: string) {
    return this.appointmentsService.findByUsername(username);
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

  @Post(':id/documents')
  addDocument(
    @Param('id') id: string,
    @Body() documentData: { document_id: string; name: string; file_url: string }
  ) {
    return this.appointmentsService.addDocument(id, documentData);
  }

  @Post(':id/documents/batch')
  addMultipleDocuments(
    @Param('id') id: string,
    @Body() documentsData: Array<{ document_id: string; name: string; file_url: string }>
  ) {
    return this.appointmentsService.addMultipleDocuments(id, documentsData);
  }

  @Delete(':id/documents/:documentId')
  removeDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string
  ) {
    return this.appointmentsService.removeDocument(id, documentId);
  }

  @Put(':id/documents/:documentId/status')
  updateDocumentStatus(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Body('status') status: string
  ) {
    return this.appointmentsService.updateDocumentStatus(id, documentId, status);
  }
}

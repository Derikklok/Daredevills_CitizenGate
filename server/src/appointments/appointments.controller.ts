import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';

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

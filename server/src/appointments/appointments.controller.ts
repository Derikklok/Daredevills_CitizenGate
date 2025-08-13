import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AddAppointmentDocumentDto } from './dto/add-appointment-document.dto';
import { AddAppointmentDocumentsBatchDto } from './dto/add-appointment-documents-batch.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

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
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiResponse({ status: 201, type: Appointment })
  create(@Body() body: CreateAppointmentDto) {
    const payload: Partial<Appointment> = {
      ...body,
      birth_date: new Date(body.birth_date),
      appointment_time: new Date(body.appointment_time),
    } as unknown as Partial<Appointment>;
    return this.appointmentsService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'List appointments with optional filters' })
  @ApiQuery({ name: 'department_id', required: false, type: Number })
  @ApiQuery({ name: 'service_id', required: false, type: String })
  @ApiQuery({ name: 'nic', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: [Appointment] })
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
  @ApiOperation({ summary: 'Find appointments by NIC' })
  @ApiParam({ name: 'nic', type: String })
  @ApiResponse({ status: 200, type: [Appointment] })
  findByNIC(@Param('nic') nic: string) {
    return this.appointmentsService.findByNIC(nic);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Appointment })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Appointment })
  update(@Param('id') id: string, @Body() body: Partial<Appointment> | any) {
    const payload: Partial<Appointment> = { ...body };
    if (body?.birth_date && typeof body.birth_date === 'string') {
      (payload as any).birth_date = new Date(body.birth_date);
    }
    if (body?.appointment_time && typeof body.appointment_time === 'string') {
      (payload as any).appointment_time = new Date(body.appointment_time);
    }
    return this.appointmentsService.update(id, payload);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAppointmentStatusDto })
  @ApiResponse({ status: 200, type: Appointment })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentStatusDto) {
    const { status } = dto;
    return this.appointmentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Appointment deleted' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Add a document to an appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddAppointmentDocumentDto })
  @ApiResponse({ status: 200, type: Appointment })
  addDocument(
    @Param('id') id: string,
    @Body() documentData: AddAppointmentDocumentDto
  ) {
    return this.appointmentsService.addDocument(id, documentData);
  }

  @Post(':id/documents/batch')
  @ApiOperation({ summary: 'Add multiple documents to an appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddAppointmentDocumentsBatchDto })
  @ApiResponse({ status: 200, type: Appointment })
  addMultipleDocuments(
    @Param('id') id: string,
    @Body() documentsData: AddAppointmentDocumentsBatchDto
  ) {
    return this.appointmentsService.addMultipleDocuments(id, documentsData.documents);
  }

  @Delete(':id/documents/:documentId')
  @ApiOperation({ summary: 'Remove a document from an appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'documentId', type: String })
  @ApiResponse({ status: 200, type: Appointment })
  removeDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string
  ) {
    return this.appointmentsService.removeDocument(id, documentId);
  }

  @Put(':id/documents/:documentId/status')
  @ApiOperation({ summary: 'Update the verification status of a submitted document' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'documentId', type: String })
  @ApiBody({ schema: { properties: { status: { type: 'string', enum: ['pending', 'verified', 'rejected'] } } } })
  @ApiResponse({ status: 200, type: Appointment })
  updateDocumentStatus(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Body('status') status: string
  ) {
    return this.appointmentsService.updateDocumentStatus(id, documentId, status);
  }
}

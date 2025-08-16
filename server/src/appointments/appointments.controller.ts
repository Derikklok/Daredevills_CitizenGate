import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateDraftAppointmentDto } from './dto/create-draft-appointment.dto';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AddAppointmentDocumentDto } from './dto/add-appointment-document.dto';
import { AddAppointmentDocumentsBatchDto } from './dto/add-appointment-documents-batch.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { OrganizationAuthGuard } from '../auth/guards/organization-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserWithOrg } from '../auth/decorators/current-user-with-org.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../auth/enums/roles.enum';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { AuthenticatedUserWithOrganization } from '../auth/guards/organization-auth.guard';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post('draft')
  @ApiOperation({ summary: 'Create a draft appointment (step 1 of the booking process)' })
  @ApiResponse({ status: 201, type: Appointment, description: 'Draft appointment created successfully' })
  @ApiBody({ type: CreateDraftAppointmentDto })
  async createDraft(
    @Body() body: CreateDraftAppointmentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {

    const userId = await user.accountId;
    return this.appointmentsService.createDraft(
      userId
    );
  }

  @Put(':id/update-service')
  @ApiOperation({ summary: 'Update a draft appointment with service and availability' })
  @ApiParam({ name: 'id', type: String, description: 'Draft appointment ID' })
  @ApiResponse({ status: 200, type: Appointment, description: 'Draft updated successfully' })
  @ApiBody({
    schema: {
      properties: {
        service_id: { type: 'string', format: 'uuid' },
        availability_id: { type: 'string', format: 'uuid' },
        appointment_time: { type: 'string', format: 'date-time', description: 'Specific appointment time selected by user' }
      }
    }
  })
  updateDraftService(
    @Param('id') id: string,
    @Body() body: { service_id: string; availability_id: string; appointment_time: string },
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.appointmentsService.updateDraftWithService(
      id,
      body.service_id,
      body.availability_id,
      body.appointment_time,
      user.accountId
    );
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete a draft appointment (step 3 of the booking process)' })
  @ApiParam({ name: 'id', type: String, description: 'Draft appointment ID' })
  @ApiResponse({ status: 200, type: Appointment, description: 'Appointment completed successfully' })
  @ApiBody({ type: CompleteAppointmentDto })
  completeDraft(
    @Param('id') id: string,
    @Body() body: CompleteAppointmentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.appointmentsService.completeDraft(id, body, user.accountId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a complete appointment (single step)' })
  @ApiResponse({ status: 201, type: Appointment })
  create(
    @Body() body: CreateAppointmentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const payload: Partial<Appointment> = {
      ...body,
      birth_date: new Date(body.birth_date),
      appointment_time: new Date(body.appointment_time),
      user_id: user.accountId,
    } as unknown as Partial<Appointment>;
    return this.appointmentsService.create(payload);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get appointments for the current user' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: [Appointment] })
  async getMyAppointments(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const userId = user.accountId;

    const filters = {
      user_id: userId,
      status: status,
      date: date,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    return this.appointmentsService.findAll(filters);
  }

  @Get('admin')
  @UseGuards(ClerkAuthGuard, OrganizationAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get all appointments in the organization (Admin only)' })
  @ApiQuery({ name: 'department_id', required: false, type: Number })
  @ApiQuery({ name: 'service_id', required: false, type: String })
  @ApiQuery({ name: 'nic', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiResponse({ status: 200, type: [Appointment] })
  async getOrganizationAppointments(
    @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization,
    @Query('department_id') departmentId?: number,
    @Query('service_id') serviceId?: string,
    @Query('nic') nic?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('username') username?: string,
  ) {
    const organizationId = user.organization?.id;

    if (!organizationId) {
      throw new UnauthorizedException('User must be part of an organization to access this endpoint');
    }

    const filters = {
      department_id: departmentId,
      service_id: serviceId,
      nic: nic,
      username: username,
      status: status,
      date: date,
      organization_id: organizationId,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    return this.appointmentsService.findAllForOrganization(filters);
  }

  @Get('by-nic/:nic')
  @ApiOperation({ summary: 'Find appointments by NIC' })
  @ApiParam({ name: 'nic', type: String })
  @ApiResponse({ status: 200, type: [Appointment] })

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

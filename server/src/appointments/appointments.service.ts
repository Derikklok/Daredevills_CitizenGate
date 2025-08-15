import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { GovernmentServicesService } from '../government-services/government-services.service';
import { ServiceAvailabilityService } from '../service-availability/service-availability.service';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly governmentServicesService: GovernmentServicesService,
    private readonly serviceAvailabilityService: ServiceAvailabilityService,
  ) { }

  async createDraft(userId: string) {
    const draftData: Partial<Appointment> = {
      appointment_status: 'draft',
      notes: `Draft appointment for user: ${userId}`,
      full_name: 'DRAFT_PENDING',
      nic: 'DRAFT_PENDING',
      phone_number: 'DRAFT_PENDING',
      birth_date: new Date('1900-01-01'),
      gender: 'DRAFT_PENDING',
      appointment_time: new Date(),
    };

    const appointment = this.appointmentRepo.create(draftData);
    return this.appointmentRepo.save(appointment);
  }

  async updateDraftWithService(appointmentId: string, serviceId: string, availabilityId: string, userId: string) {
    const appointment = await this.findOne(appointmentId);

    // Verify this is a draft appointment
    if (appointment.appointment_status !== 'draft') {
      throw new BadRequestException('This appointment is not a draft');
    }

    // Verify user owns this draft (check notes field for user ID)
    if (!appointment.notes?.includes(userId)) {
      throw new BadRequestException('You can only update your own draft appointments');
    }

    // Verify that the service and availability exist
    const service = await this.governmentServicesService.findOne(serviceId);
    const availability = await this.serviceAvailabilityService.findOne(availabilityId);

    console.log('Service ID from request:', serviceId);
    console.log('Availability ID from request:', availabilityId);
    console.log('Service found:', service ? 'Yes' : 'No');
    console.log('Availability found:', availability ? 'Yes' : 'No');
    console.log('Availability service_id:', availability?.service_id);

    // Check if the service matches the availability
    if (availability.service_id !== serviceId) {
      console.error(`Service mismatch: availability.service_id (${availability.service_id}) !== serviceId (${serviceId})`);
      throw new BadRequestException('The selected availability does not belong to the selected service');
    }

    // Update the appointment with service details
    // Create a proper timestamp for appointment_time using current date + availability start time
    const today = new Date();
    const [hours, minutes] = availability.start_time.split(':').map(Number);
    const appointmentTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);

    const updateData = {
      service_id: serviceId,
      availability_id: availabilityId,
      appointment_time: appointmentTime,
    };

    await this.appointmentRepo.update(appointmentId, updateData);
    return this.findOne(appointmentId);
  }

  async completeDraft(appointmentId: string, completeData: CompleteAppointmentDto, userId: string) {
    const appointment = await this.findOne(appointmentId);

    // Verify this is a draft appointment
    if (appointment.appointment_status !== 'draft') {
      throw new BadRequestException('This appointment is not a draft');
    }

    // Verify user owns this draft (check notes field for user ID)
    if (!appointment.notes?.includes(userId)) {
      throw new BadRequestException('You can only complete your own draft appointments');
    }

    // Validate appointment time is within availability
    const appointmentTime = new Date(completeData.appointment_time);
    const availability = await this.serviceAvailabilityService.findOne(appointment.availability_id);

    const availabilityStart = new Date(availability.start_time);
    const availabilityEnd = new Date(availability.end_time);

    if (appointmentTime < availabilityStart || appointmentTime > availabilityEnd) {
      throw new BadRequestException('Appointment time is outside the available time slot');
    }

    // Update the appointment with complete data
    const updateData = {
      ...completeData,
      birth_date: new Date(completeData.birth_date),
      appointment_time: appointmentTime,
      appointment_status: 'pending',
      notes: completeData.notes || null, // Clear the draft user ID note
    };

    return this.appointmentRepo.update(appointmentId, updateData);
  }

  async create(data: Partial<Appointment>) {
    // Verify that the service and availability exist
    const service = await this.governmentServicesService.findOne(data.service_id);
    const availability = await this.serviceAvailabilityService.findOne(data.availability_id);

    // Check if the service matches the availability
    if (availability.service_id !== data.service_id) {
      throw new BadRequestException('The selected availability does not belong to the selected service');
    }

    // Check if the appointment time is within the service availability time slots
    const appointmentTime = new Date(data.appointment_time);

    // Format times to compare without timezone issues
    const availabilityStart = new Date(availability.start_time);
    const availabilityEnd = new Date(availability.end_time);

    if (appointmentTime < availabilityStart || appointmentTime > availabilityEnd) {
      throw new BadRequestException('Appointment time is outside the available time slot');
    }

    // Set initial status to pending
    if (!data.appointment_status) {
      data.appointment_status = 'pending';
    }

    // Process documents if submitted with the initial appointment
    if (data.documents_submitted && Array.isArray(data.documents_submitted)) {
      // Add verification_status 'pending' and timestamp to each document
      data.documents_submitted = data.documents_submitted.map(doc => ({
        document_id: doc.document_id,
        name: doc.name,
        file_url: doc.file_url,
        verification_status: 'pending',
        uploaded_at: new Date()
      }));
    }

    const appointment = this.appointmentRepo.create(data);
    return this.appointmentRepo.save(appointment);
  }

  async findAll(filters?: any) {
    const query = this.appointmentRepo.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.service', 'service')
      .leftJoinAndSelect('service.department', 'department')
      .leftJoinAndSelect('appointment.availability', 'availability');

    if (filters?.department_id) {
      query.andWhere('department.department_id = :departmentId', {
        departmentId: filters.department_id
      });
    }

    if (filters?.service_id) {
      query.andWhere('service.service_id = :serviceId', {
        serviceId: filters.service_id
      });
    }

    if (filters?.nic) {
      query.andWhere('appointment.nic = :nic', { nic: filters.nic });
    }

    if (filters?.status) {
      query.andWhere('appointment.appointment_status = :status', {
        status: filters.status
      });
    }

    if (filters?.date) {
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);

      query.andWhere('appointment.appointment_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    if (filters?.appointment_time) {
      if (filters.appointment_time.from && filters.appointment_time.to) {
        const startDate = new Date(filters.appointment_time.from);
        const endDate = new Date(filters.appointment_time.to);

        query.andWhere('appointment.appointment_time BETWEEN :startDate AND :endDate', {
          startDate,
          endDate
        });
      } else if (filters.appointment_time.after) {
        const afterDate = new Date(filters.appointment_time.after);
        query.andWhere('appointment.appointment_time > :afterDate', { afterDate });
      } else if (filters.appointment_time.before) {
        const beforeDate = new Date(filters.appointment_time.before);
        query.andWhere('appointment.appointment_time < :beforeDate', { beforeDate });
      }
    }

    if (filters?.exclude_reminders_sent) {
      query.andWhere('appointment.reminders_sent IS NULL OR jsonb_array_length(appointment.reminders_sent) = 0');
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: { appointment_id: id },
      relations: ['service', 'service.department', 'availability']
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, data: Partial<Appointment>) {
    await this.findOne(id); // Check if exists
    await this.appointmentRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    return this.appointmentRepo.remove(appointment);
  }

  async findByNIC(nic: string) {
    return this.appointmentRepo.find({
      where: { nic },
      relations: ['service', 'service.department', 'availability'],
      order: { appointment_time: 'DESC' }
    });
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return this.update(id, { appointment_status: status });
  }

  async addDocuments(id: string, documents: Array<{
    document_id: string;
    name: string;
    file_url: string;
    uploaded_at?: Date;
    verification_status?: string;
  }>) {
    const appointment = await this.findOne(id);

    // Initialize documents array if it doesn't exist
    if (!appointment.documents_submitted) {
      appointment.documents_submitted = [];
    }

    // Add verification status and upload timestamp to each document
    const processedDocuments = documents.map(doc => ({
      ...doc,
      verification_status: doc.verification_status || 'pending',
      uploaded_at: doc.uploaded_at || new Date()
    }));

    // Add new documents to the existing array
    appointment.documents_submitted = [
      ...appointment.documents_submitted,
      ...processedDocuments
    ];

    // Save and return updated appointment
    return this.appointmentRepo.save(appointment);
  }

  /**
   * Add a document to an appointment
   * @param id Appointment ID
   * @param documentData Document data containing document_id, name, and file_url
   */
  async addDocument(id: string, documentData: {
    document_id: string;
    name: string;
    file_url: string;
  }) {
    const appointment = await this.findOne(id);

    // Initialize documents_submitted array if it doesn't exist
    if (!appointment.documents_submitted) {
      appointment.documents_submitted = [];
    }

    // Check if a document with the same document_id already exists
    const existingDocIndex = appointment.documents_submitted.findIndex(
      doc => doc.document_id === documentData.document_id
    );

    if (existingDocIndex >= 0) {
      // Update existing document
      appointment.documents_submitted[existingDocIndex] = {
        ...documentData,
        uploaded_at: new Date(),
        verification_status: 'pending'
      };
    } else {
      // Add new document
      appointment.documents_submitted.push({
        ...documentData,
        uploaded_at: new Date(),
        verification_status: 'pending'
      });
    }

    return this.appointmentRepo.save(appointment);
  }

  /**
   * Add multiple documents to an appointment
   * @param id Appointment ID
   * @param documentsData Array of document data
   */
  async addMultipleDocuments(id: string, documentsData: Array<{
    document_id: string;
    name: string;
    file_url: string;
  }>) {
    const appointment = await this.findOne(id);

    // Initialize documents_submitted array if it doesn't exist
    if (!appointment.documents_submitted) {
      appointment.documents_submitted = [];
    }

    // Process each document
    for (const docData of documentsData) {
      const existingDocIndex = appointment.documents_submitted.findIndex(
        doc => doc.document_id === docData.document_id
      );

      if (existingDocIndex >= 0) {
        // Update existing document
        appointment.documents_submitted[existingDocIndex] = {
          ...docData,
          uploaded_at: new Date(),
          verification_status: 'pending'
        };
      } else {
        // Add new document
        appointment.documents_submitted.push({
          ...docData,
          uploaded_at: new Date(),
          verification_status: 'pending'
        });
      }
    }

    return this.appointmentRepo.save(appointment);
  }

  /**
   * Remove a document from an appointment
   * @param id Appointment ID
   * @param documentId Document ID to remove
   */
  async removeDocument(id: string, documentId: string) {
    const appointment = await this.findOne(id);

    if (!appointment.documents_submitted) {
      throw new NotFoundException(`No documents found for appointment with ID ${id}`);
    }

    // Filter out the document to remove
    appointment.documents_submitted = appointment.documents_submitted.filter(
      doc => doc.document_id !== documentId
    );

    return this.appointmentRepo.save(appointment);
  }

  /**
   * Update document verification status
   * @param id Appointment ID
   * @param documentId Document ID
   * @param status New verification status
   */
  async updateDocumentStatus(id: string, documentId: string, status: string) {
    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid document status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const appointment = await this.findOne(id);

    if (!appointment.documents_submitted) {
      throw new NotFoundException(`No documents found for appointment with ID ${id}`);
    }

    // Find the document to update
    const docIndex = appointment.documents_submitted.findIndex(
      doc => doc.document_id === documentId
    );

    if (docIndex === -1) {
      throw new NotFoundException(`Document with ID ${documentId} not found in appointment ${id}`);
    }

    // Update document status
    appointment.documents_submitted[docIndex].verification_status = status;

    return this.appointmentRepo.save(appointment);
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { GovernmentServicesService } from '../government-services/government-services.service';
import { ServiceAvailabilityService } from '../service-availability/service-availability.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly governmentServicesService: GovernmentServicesService,
    private readonly serviceAvailabilityService: ServiceAvailabilityService,
  ) {}

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
}

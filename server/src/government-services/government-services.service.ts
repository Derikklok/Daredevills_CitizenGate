import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernmentService } from './government-service.entity';
import { GovernmentServiceCreateDto } from './dto/government-service.create.dto';
import { GovernmentServiceUpdateDto } from './dto/government-service.update.dto';
import { ClerkService } from '../auth/services/clerk.service';

@Injectable()
export class GovernmentServicesService {
  constructor(
    @InjectRepository(GovernmentService)
    private readonly serviceRepo: Repository<GovernmentService>,
    private readonly clerkService: ClerkService,
  ) { }

  create(data: GovernmentServiceCreateDto, organizationId: string) {
    // Map DTO to Entity
    const mappedService = {
      name: data.name,
      description: data.description,
      department_id: organizationId,
      category: data.category,
      estimated_total_completion_time: data.estimated_total_completion_time,
    };
    return this.serviceRepo.save(mappedService);
  }

  async findAll() {
    try {
      return this.serviceRepo.find();
    } catch (error) {
      console.error('Error finding all government services:', error);
      throw new Error('Failed to find all government services');
    }
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findOne({ where: { service_id: id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, data: GovernmentServiceUpdateDto, organizationId: string) {
    const service = await this.findOne(id);

    // Check if user has permission to update this service
    // For now, we'll allow updates if the service belongs to the user's organization
    // You might want to implement more sophisticated permission logic here

    // Map DTO to Entity
    const mappedService = {
      ...service,
      ...data,
    } as GovernmentService;
    return this.serviceRepo.save(mappedService);
  }

  async remove(id: string, organizationId: string) {
    const service = await this.findOne(id);

    // Check if user has permission to delete this service
    // For now, we'll allow deletion if the service belongs to the user's organization
    // You might want to implement more sophisticated permission logic here

    return this.serviceRepo.remove(service);
  }
}

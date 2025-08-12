import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernmentService } from './government-service.entity';

@Injectable()
export class GovernmentServicesService {
  constructor(
    @InjectRepository(GovernmentService)
    private readonly serviceRepo: Repository<GovernmentService>,
  ) {}

  create(data: Partial<GovernmentService>) {
    const service = this.serviceRepo.create(data);
    return this.serviceRepo.save(service);
  }

  findAll() {
    return this.serviceRepo.find({ relations: ['department'] });
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findOne({ where: { service_id: id }, relations: ['department'] });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, data: Partial<GovernmentService>) {
    const service = await this.findOne(id);
    Object.assign(service, data);
    return this.serviceRepo.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    return this.serviceRepo.remove(service);
  }
}

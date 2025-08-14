import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { GovernmentService } from './government-service.entity';

@Injectable()
export class GovernmentServicesService {
  constructor(
    @InjectRepository(GovernmentService)
    private readonly serviceRepo: Repository<GovernmentService>,
  ) {}

  async create(data: Partial<GovernmentService>) {
    // Create the service with all provided data
    const service = this.serviceRepo.create(data);
    return this.serviceRepo.save(service);
  }

  findAll(name?: string) {
    if (name) {
      return this.serviceRepo.find({
        where: {
          name: this.createILikePattern(name)
        },
        relations: ['department']
      });
    }
    return this.serviceRepo.find({ 
      relations: ['department']
    });
  }

  async findByDepartment(departmentId: number, name?: string) {
    if (name) {
      return this.serviceRepo.find({
        where: {
          department_id: departmentId,
          name: this.createILikePattern(name)
        },
        relations: ['department']
      });
    }
    
    return this.serviceRepo.find({
      where: { department_id: departmentId },
      relations: ['department']
    });
  }
  
  private createILikePattern(name: string) {
    // Create a case-insensitive LIKE pattern for PostgreSQL using TypeORM's ILike
    return ILike(`%${name}%`);
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findOne({ 
      where: { service_id: id }, 
      relations: ['department']
    });
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

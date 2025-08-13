import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceAvailability } from './service-availability.entity';

@Injectable()
export class ServiceAvailabilityService {
  constructor(
    @InjectRepository(ServiceAvailability)
    private readonly availabilityRepo: Repository<ServiceAvailability>,
  ) {}

  async create(data: any) {
    // Check if we received a days_of_week array
    if (data.days_of_week && Array.isArray(data.days_of_week)) {
      // Use the createForMultipleDays method
      return this.createForMultipleDays(data);
    }

    // Regular single day creation
    const availability = this.availabilityRepo.create({
      ...data,
      service_id: data.service_id
    });
    return this.availabilityRepo.save(availability);
  }

  async createBatch(dataArray: Partial<ServiceAvailability>[]) {
    const availabilities = dataArray.map(data => 
      this.availabilityRepo.create({
        ...data,
        service_id: data.service_id
      })
    );
    return this.availabilityRepo.save(availabilities);
  }
  
  async createForMultipleDays(
    data: Omit<Partial<ServiceAvailability>, 'day_of_week'> & { days_of_week: string[] }
  ) {
    const { days_of_week, ...baseData } = data;
    
    // Create an availability entry for each day
    const availabilities = days_of_week.map(day =>
      this.availabilityRepo.create({
        ...baseData,
        day_of_week: day,
        service_id: baseData.service_id
      })
    );
    
    return this.availabilityRepo.save(availabilities);
  }

  findAll() {
    return this.availabilityRepo.find({ 
      relations: ['service', 'service.department']
    });
  }

  findByService(serviceId: string) {
    return this.availabilityRepo.find({
      where: { service_id: serviceId },
      order: { day_of_week: 'ASC', start_time: 'ASC' },
      relations: ['service', 'service.department']
    });
  }

  async findOne(id: string) {
    const availability = await this.availabilityRepo.findOne({ 
      where: { availability_id: id },
      relations: ['service', 'service.department']
    });
    if (!availability) throw new NotFoundException('Availability not found');
    return availability;
  }

  async update(id: string, data: Partial<ServiceAvailability>) {
    const availability = await this.findOne(id);
    Object.assign(availability, data);
    return this.availabilityRepo.save(availability);
  }

  async remove(id: string) {
    const availability = await this.findOne(id);
    return this.availabilityRepo.remove(availability);
  }
}

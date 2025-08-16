import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto';
import { GovernmentServicesService } from '../government-services/government-services.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private governmentServicesService: GovernmentServicesService
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    // Check if government service exists
    await this.governmentServicesService.findOne(createFeedbackDto.serviceId);
    
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return await this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      relations: ['service']
    });
  }

  async findByServiceId(serviceId: string): Promise<Feedback[]> {
    // Verify the government service exists
    await this.governmentServicesService.findOne(serviceId);
    
    return await this.feedbackRepository.find({ 
      where: { serviceId },
      relations: ['service']
    });
  }
}

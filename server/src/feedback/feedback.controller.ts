import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto';
import { Feedback } from './feedback.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Submit user feedback for a service' })
  @ApiResponse({
    status: 201,
    description: 'Feedback successfully submitted',
    type: Feedback,
  })
  async create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return await this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback entries' })
  @ApiResponse({
    status: 200,
    description: 'Returns all feedback entries',
    type: [Feedback],
  })
  async findAll(): Promise<Feedback[]> {
    return await this.feedbackService.findAll();
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get all feedback for a specific government service' })
  @ApiResponse({
    status: 200,
    description: 'Returns all feedback for the specified government service',
    type: [Feedback],
  })
  async findByServiceId(@Param('serviceId') serviceId: string): Promise<Feedback[]> {
    return await this.feedbackService.findByServiceId(serviceId);
  }
}

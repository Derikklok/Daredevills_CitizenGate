import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Feedback } from './feedback.entity';
import { GovernmentServicesModule } from '../government-services/government-services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    GovernmentServicesModule
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService]
})
export class FeedbackModule {}

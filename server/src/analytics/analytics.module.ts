import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { Appointment } from '../appointments/appointment.entity';
import { GovernmentService } from '../government-services/government-service.entity';
import { Department } from '../departments/department.entity';
import { AnalyticsController } from './analytics.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment, GovernmentService, Department]),
        AuthModule
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService]
})
export class AnalyticsModule { }

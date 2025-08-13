import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { GovernmentServicesModule } from '../government-services/government-services.module';
import { ServiceAvailabilityModule } from '../service-availability/service-availability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    GovernmentServicesModule,
    ServiceAvailabilityModule
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService]
})
export class AppointmentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceAvailabilityService } from './service-availability.service';
import { ServiceAvailabilityController } from './service-availability.controller';
import { ServiceAvailability } from './service-availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceAvailability])],
  providers: [ServiceAvailabilityService],
  controllers: [ServiceAvailabilityController],
  exports: [ServiceAvailabilityService]
})
export class ServiceAvailabilityModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernmentServicesController } from './government-services.controller';
import { GovernmentServicesService } from './government-services.service';
import { GovernmentService } from './government-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GovernmentService])],
  controllers: [GovernmentServicesController],
  providers: [GovernmentServicesService],
  exports: [GovernmentServicesService]
})
export class GovernmentServicesModule {}

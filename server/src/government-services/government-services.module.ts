import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernmentServicesController } from './government-services.controller';
import { GovernmentServicesService } from './government-services.service';
import { GovernmentService } from './government-service.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GovernmentService]), AuthModule],
  controllers: [GovernmentServicesController],
  providers: [GovernmentServicesService],
  exports: [GovernmentServicesService]
})
export class GovernmentServicesModule { }

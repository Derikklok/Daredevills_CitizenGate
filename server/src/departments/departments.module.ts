import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService]
})
export class DepartmentsModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Repository } from 'typeorm';
import { ClerkService } from 'src/auth/services/clerk.service';
import { DepartmentReadDto } from './dto/department.read.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly clerkService: ClerkService,
  ) { }

  async findAll(): Promise<DepartmentReadDto[]> {
    try {
      const organizationList = await this.clerkService.getOrganizationList();
      return organizationList;
    } catch (error) {
      console.error('Error finding all departments:', error);
      throw new Error('Failed to find all departments');
    }
  }

  async findOne(id: string): Promise<DepartmentReadDto> {
    try {
      const organization = await this.clerkService.getOrganization(id);
      return organization;
    } catch (error) {
      console.error('Error finding department:', error);
      throw new NotFoundException('Department not found');
    }
  }
}

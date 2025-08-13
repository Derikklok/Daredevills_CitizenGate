import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Repository } from 'typeorm';
import { ClerkService } from 'src/auth/services/clerk.service';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { DepartmentCreateDto } from './dto/department.create.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    private readonly clerkService: ClerkService,
  ) { }

  /**
   * This function frist creates a clerk organization and then creates a department with the clerk organization id
   * @param data
   * @param user
   * @returns
   */
  async create(data: DepartmentCreateDto, user: AuthenticatedUser) {
    try {
      let clerkOrganizationId = data.clerk_org_id;

      if (!clerkOrganizationId) {
        // Create organization in Clerk
        const clerkOrganization = await this.clerkService.createOrganization({
          name: data.name,
          slug: data.name.toLowerCase().replace(/\s+/g, '-'),
          metadata: {
            address: data.address,
            contact_email: data.contact_email,
            contact_phone: data.contact_phone,
            created_by: user.accountId,
          },
          image_url: data.image_url || '',
        });
        clerkOrganizationId = clerkOrganization.id;
      }

      // Create department with Clerk organization ID
      const dept = this.deptRepo.create({
        ...data,
        clerk_org_id: clerkOrganizationId,
      });

      return this.deptRepo.save(dept);
    } catch (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }
  }

  findAll() {
    return this.deptRepo.find({
      relations: ['services']  // Include the services relation
    });
  }

  async findOne(id: number) {
    const dept = await this.deptRepo.findOne({
      where: { department_id: id },
      relations: ['services']  // Include the services relation
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async findOrganization(id: string) {
    const organization = await this.clerkService.getOrganization(id);
    return organization;
  }

  async update(id: number, data: Partial<Department>) {
    const dept = await this.findOne(id);
    Object.assign(dept, data);
    return this.deptRepo.save(dept);
  }

  async remove(id: number) {
    const dept = await this.findOne(id);
    return this.deptRepo.remove(dept);
  }
}

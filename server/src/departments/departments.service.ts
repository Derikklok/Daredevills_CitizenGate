import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
      // Check if department with this name already exists
      const existingDept = await this.deptRepo.findOne({
        where: { name: data.name }
      });

      if (existingDept) {
        throw new BadRequestException(`A department with the name "${data.name}" already exists.`);
      }

      let clerkOrganizationId = data.clerk_org_id;

      if (!clerkOrganizationId) {
        try {
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
          });
          clerkOrganizationId = clerkOrganization.id;
        } catch (clerkError) {
          console.error('Clerk organization creation error:', clerkError);
          throw new BadRequestException(`Failed to create Clerk organization: ${clerkError.message}`);
        }
      }

      // Create department with Clerk organization ID
      const dept = this.deptRepo.create({
        ...data,
        clerk_org_id: clerkOrganizationId,
      });

      return this.deptRepo.save(dept);
    } catch (error) {
      console.error('Department creation error:', error);

      if (error.message?.includes('Unprocessable Entity')) {
        throw new BadRequestException('Invalid department data provided. Please check all required fields.');
      }

      if (error.message?.includes('duplicate key')) {
        throw new BadRequestException('A department with this name already exists.');
      }

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

  async remove(id: number, user: AuthenticatedUser) {
    const dept = await this.findOne(id);
    if (dept.clerk_org_id !== user.organizationId) {
      throw new ForbiddenException('You are not authorized to delete this department');
    }

    // Delete organization in Clerk
    if (dept.clerk_org_id) {
      try {

        await this.clerkService.deleteOrganization(dept.clerk_org_id);
      } catch (error) {
        // Log the error but don't fail the deletion
        console.warn(`Failed to delete Clerk organization: ${error.message}`);
      }
    }

    return this.deptRepo.remove(dept);
  }

  async deleteOrganization(orgId: string) {
    const organization = await this.clerkService.getOrganization(orgId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.clerkService.deleteOrganization(orgId);

    const departmentWithOrgId = await this.deptRepo.find({
      where: { clerk_org_id: orgId }
    });

    if (departmentWithOrgId.length > 0) {
      await this.deptRepo.remove(departmentWithOrgId);
    }

    return {
      message: 'Organization deleted successfully',
      organization: organization,
      department: departmentWithOrgId,
    };
  }
}

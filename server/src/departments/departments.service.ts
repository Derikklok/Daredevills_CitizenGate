import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private readonly deptRepo: Repository<Department>,
    ){}

    create(data : Partial<Department>){
        const dept = this.deptRepo.create(data);
        return this.deptRepo.save(dept);
    }

    findAll() {
    return this.deptRepo.find();
  }

  async findOne(id: number) {
    const dept = await this.deptRepo.findOne({ where: { department_id: id } });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
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

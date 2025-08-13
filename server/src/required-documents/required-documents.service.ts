import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequiredDocument } from './required-document.entity';

@Injectable()
export class RequiredDocumentsService {
  constructor(
    @InjectRepository(RequiredDocument)
    private readonly documentRepo: Repository<RequiredDocument>,
  ) {}

  create(data: Partial<RequiredDocument>) {
    const document = this.documentRepo.create(data);
    return this.documentRepo.save(document);
  }

  createMany(dataArray: Partial<RequiredDocument>[]) {
    const documents = dataArray.map(data => this.documentRepo.create(data));
    return this.documentRepo.save(documents);
  }

  findAll() {
    return this.documentRepo.find({ 
      relations: ['service', 'service.department'] 
    });
  }

  findByService(serviceId: string) {
    return this.documentRepo.find({
      where: { service_id: serviceId },
      relations: ['service', 'service.department']
    });
  }

  async findOne(id: string) {
    const document = await this.documentRepo.findOne({ 
      where: { document_id: id },
      relations: ['service', 'service.department']
    });
    
    if (!document) {
      throw new NotFoundException('Required document not found');
    }
    
    return document;
  }

  async update(id: string, data: Partial<RequiredDocument>) {
    const document = await this.findOne(id);
    Object.assign(document, data);
    return this.documentRepo.save(document);
  }

  async remove(id: string) {
    const document = await this.findOne(id);
    return this.documentRepo.remove(document);
  }
}

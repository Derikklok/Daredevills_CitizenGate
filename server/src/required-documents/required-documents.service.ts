import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { RequiredDocument } from './required-document.entity';

@Injectable()
export class RequiredDocumentsService {
  constructor(
    @InjectRepository(RequiredDocument)
    private readonly documentRepo: Repository<RequiredDocument>,
  ) {}

  async create(data: Partial<RequiredDocument>) {
    // Check if document with same name already exists for this service
    const existingDocument = await this.documentRepo.findOne({
      where: {
        service_id: data.service_id,
        name: data.name,
      },
    });

    if (existingDocument) {
      throw new ConflictException(`Document with name "${data.name}" already exists for this service`);
    }

    const document = this.documentRepo.create(data);
    return this.documentRepo.save(document);
  }

  async createMany(dataArray: Partial<RequiredDocument>[]) {
    // Check for duplicates within the array itself
    const serviceDocMap = new Map();
    dataArray.forEach(doc => {
      const key = `${doc.service_id}-${doc.name}`;
      if (serviceDocMap.has(key)) {
        throw new ConflictException(`Duplicate document "${doc.name}" found in the request`);
      }
      serviceDocMap.set(key, true);
    });

    // Check for duplicates in database
    for (const data of dataArray) {
      const existingDocument = await this.documentRepo.findOne({
        where: {
          service_id: data.service_id,
          name: data.name,
        },
      });

      if (existingDocument) {
        throw new ConflictException(`Document with name "${data.name}" already exists for service ${data.service_id}`);
      }
    }

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
    
    // If the name is being changed, check for duplicates
    if (data.name && data.name !== document.name) {
      const existingDocument = await this.documentRepo.findOne({
        where: {
          service_id: document.service_id,
          name: data.name,
          // Exclude the current document from the check
          document_id: Not(id) // TypeORM syntax for "not equal"
        },
      });

      if (existingDocument) {
        throw new ConflictException(`Document with name "${data.name}" already exists for this service`);
      }
    }
    
    Object.assign(document, data);
    return this.documentRepo.save(document);
  }

  async remove(id: string) {
    const document = await this.findOne(id);
    return this.documentRepo.remove(document);
  }
}

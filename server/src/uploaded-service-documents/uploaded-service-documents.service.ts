import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { UploadedServiceDocuments } from "./uploaded-service-documents.entity";
import { UploadedServiceDocumentsCreateDto } from "./dto/uploaded-service-documents.create.dto";
import { SupabaseService } from "./supabase.service";

@Injectable()
export class UploadedServiceDocumentsService {
    constructor(
        @InjectRepository(UploadedServiceDocuments)
        private readonly uploadedServiceDocumentsRepository: Repository<UploadedServiceDocuments>,
        private readonly supabaseService: SupabaseService,
    ) { }

    async uploadAndSaveFile(
        file: Express.Multer.File,
        createDto: UploadedServiceDocumentsCreateDto,
        userId: string
    ): Promise<UploadedServiceDocuments> {
        try {
            // Create folder structure: userId/appointmentId/documents
            const folderPath = `${userId}/${createDto.appointmentId}/documents`;

            // Upload file to Supabase
            const { key } = await this.supabaseService.uploadFile(file, folderPath);

            // Create database record
            const uploadedDocument = this.uploadedServiceDocumentsRepository.create({
                id: uuidv4(),
                s3Key: key,
                fileName: file.originalname,
                fileType: file.mimetype,
                serviceId: createDto.serviceId,
                requiredDocumentId: createDto.requiredDocumentId,
                userId: userId,
                appointmentId: createDto.appointmentId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return await this.uploadedServiceDocumentsRepository.save(uploadedDocument);
        } catch (error) {
            throw new Error(`Failed to upload and save file: ${error.message}`);
        }
    }

    async create(createUploadedServiceDocumentsDto: UploadedServiceDocumentsCreateDto) {
        const uploadedServiceDocuments = this.uploadedServiceDocumentsRepository.create(createUploadedServiceDocumentsDto);
        return this.uploadedServiceDocumentsRepository.save(uploadedServiceDocuments);
    }

    async findAll() {
        return this.uploadedServiceDocumentsRepository.find();
    }

    async findOne(id: string) {
        const document = await this.uploadedServiceDocumentsRepository.findOne({ where: { id } });
        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }
        return document;
    }

    async findByUserId(userId: string): Promise<UploadedServiceDocuments[]> {
        return this.uploadedServiceDocumentsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async findByAppointmentId(appointmentId: string): Promise<UploadedServiceDocuments[]> {
        return this.uploadedServiceDocumentsRepository.find({
            where: { appointmentId },
            order: { createdAt: 'DESC' }
        });
    }

    async findByUserAndAppointment(userId: string, appointmentId: string): Promise<UploadedServiceDocuments[]> {
        return this.uploadedServiceDocumentsRepository.find({
            where: { userId, appointmentId },
            order: { createdAt: 'DESC' }
        });
    }

    async findByServiceId(serviceId: string): Promise<UploadedServiceDocuments[]> {
        return this.uploadedServiceDocumentsRepository.find({
            where: { serviceId },
            order: { createdAt: 'DESC' }
        });
    }

    async getFileUrl(id: string): Promise<string> {
        const document = await this.findOne(id);
        return this.supabaseService.getFileUrl(document.s3Key);
    }

    async downloadFile(id: string): Promise<{ data: Blob; contentType: string; fileName: string }> {
        const document = await this.findOne(id);
        const fileData = await this.supabaseService.downloadFile(document.s3Key);

        return {
            data: fileData.data,
            contentType: fileData.contentType,
            fileName: document.fileName
        };
    }

    async update(id: string, updateUploadedServiceDocumentsDto: Partial<UploadedServiceDocumentsCreateDto>) {
        const document = await this.findOne(id);
        return this.uploadedServiceDocumentsRepository.update(id, {
            ...updateUploadedServiceDocumentsDto,
            updatedAt: new Date()
        });
    }

    async delete(id: string): Promise<boolean> {
        const document = await this.findOne(id);

        try {
            // Delete from Supabase storage
            await this.supabaseService.deleteFile(document.s3Key);

            // Delete from database
            await this.uploadedServiceDocumentsRepository.delete(id);

            return true;
        } catch (error) {
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }

    async deleteByAppointmentId(appointmentId: string): Promise<number> {
        const documents = await this.findByAppointmentId(appointmentId);
        let deletedCount = 0;

        for (const document of documents) {
            try {
                await this.supabaseService.deleteFile(document.s3Key);
                await this.uploadedServiceDocumentsRepository.delete(document.id);
                deletedCount++;
            } catch (error) {
                console.error(`Failed to delete document ${document.id}:`, error.message);
            }
        }

        return deletedCount;
    }
}
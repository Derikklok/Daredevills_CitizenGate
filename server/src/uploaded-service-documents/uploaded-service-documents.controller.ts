import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UseGuards,
    Query,
    BadRequestException,
    Res,
    StreamableFile,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { UploadedServiceDocumentsService } from "./uploaded-service-documents.service";
import { UploadedServiceDocumentsCreateDto } from "./dto/uploaded-service-documents.create.dto";
import { UploadDocumentDto, UploadMultipleDocumentsDto } from "./dto/upload-document.dto";
import {
    UploadedDocumentResponseDto,
    UploadMultipleResponseDto,
    DocumentUrlResponseDto,
    DeleteResponseDto,
    DeleteMultipleResponseDto
} from "./dto/upload-response.dto";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";

@ApiTags('Uploaded Service Documents')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("uploaded-service-documents")
export class UploadedServiceDocumentsController {
    constructor(
        private readonly uploadedServiceDocumentsService: UploadedServiceDocumentsService,
    ) { }

    @Get('health')
    @ApiOperation({ summary: 'Check service health and configuration' })
    @ApiResponse({ status: 200, description: 'Service health check' })
    async healthCheck() {
        try {
            // This will test if Supabase configuration is working
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                message: 'Upload service is ready'
            };
        } catch (error) {
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: error.message
            };
        }
    }

    @Get('test-supabase')
    @ApiOperation({ summary: 'Test Supabase connection and bucket access' })
    @ApiResponse({ status: 200, description: 'Supabase test results' })
    async testSupabase() {
        try {
            // Import the service temporarily to test it
            const { SupabaseService } = await import('./supabase.service');
            const { ConfigService } = await import('../config/config.service');

            const configService = new ConfigService();
            const supabaseService = new SupabaseService(configService);

            // Test listing buckets
            const supabase = (supabaseService as any).supabase;
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();

            if (listError) {
                return {
                    status: 'error',
                    timestamp: new Date().toISOString(),
                    error: 'Failed to list buckets',
                    details: listError,
                    config: {
                        supabaseUrl: configService.supabaseUrl,
                        bucketName: configService.supabaseBucketName,
                        hasServiceKey: !!configService.supabaseServiceKey
                    }
                };
            }

            const bucketExists = buckets?.some(bucket => bucket.name === configService.supabaseBucketName);

            return {
                status: 'success',
                timestamp: new Date().toISOString(),
                config: {
                    supabaseUrl: configService.supabaseUrl,
                    bucketName: configService.supabaseBucketName,
                    hasServiceKey: !!configService.supabaseServiceKey
                },
                buckets: {
                    available: buckets?.map(b => ({ name: b.name, id: b.id })) || [],
                    targetExists: bucketExists,
                    targetBucket: configService.supabaseBucketName
                }
            };
        } catch (error) {
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: error.message,
                stack: error.stack
            };
        }
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload a service document' })
    @ApiResponse({
        status: 201,
        description: 'Document uploaded successfully',
        type: UploadedDocumentResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid file or data' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload document with metadata',
        type: UploadDocumentDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|gif|pdf|doc|docx|txt|zip|rar)$/
                    }),
                ],
            }),
        ) file: Express.Multer.File,
        @Body() uploadDto: UploadDocumentDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        try {
            if (!file) {
                throw new BadRequestException('File is required');
            }

            console.log('Controller received file upload request:', {
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
                userAccountId: user.accountId,
                uploadDto
            });

            // Convert to the service DTO format
            const createDto: UploadedServiceDocumentsCreateDto = {
                fileName: file.originalname,
                fileType: file.mimetype,
                serviceId: uploadDto.serviceId,
                requiredDocumentId: uploadDto.requiredDocumentId,
                appointmentId: uploadDto.appointmentId,
            };

            const result = await this.uploadedServiceDocumentsService.uploadAndSaveFile(
                file,
                createDto,
                user.accountId
            );

            console.log('File upload completed successfully:', result.id);
            return result;
        } catch (error) {
            console.error('Controller upload error:', error);
            throw new BadRequestException(`Upload failed: ${error.message}`);
        }
    }

    @Post('upload-multiple')
    @ApiOperation({ summary: 'Upload multiple service documents' })
    @ApiResponse({
        status: 201,
        description: 'Documents uploaded successfully',
        type: UploadMultipleResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid files or data' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload multiple documents with metadata',
        type: UploadMultipleDocumentsDto,
    })
    @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
    async uploadMultipleDocuments(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB per file
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|gif|pdf|doc|docx|txt|zip|rar)$/
                    }),
                ],
            }),
        ) files: Express.Multer.File[],
        @Body() uploadDto: UploadMultipleDocumentsDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one file is required');
        }

        // Parse required document IDs
        const requiredDocumentIds = uploadDto.requiredDocumentIds.split(',').map(id => id.trim());

        if (files.length !== requiredDocumentIds.length) {
            throw new BadRequestException('Number of files must match number of required document IDs');
        }

        const uploadPromises = files.map((file, index) => {
            const createDto: UploadedServiceDocumentsCreateDto = {
                fileName: file.originalname,
                fileType: file.mimetype,
                serviceId: uploadDto.serviceId,
                requiredDocumentId: requiredDocumentIds[index],
                appointmentId: uploadDto.appointmentId,
            };

            return this.uploadedServiceDocumentsService.uploadAndSaveFile(
                file,
                createDto,
                user.accountId
            );
        });

        const uploadedDocuments = await Promise.all(uploadPromises);

        return {
            success: true,
            uploadedCount: uploadedDocuments.length,
            documents: uploadedDocuments
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all documents for the current user' })
    @ApiResponse({
        status: 200,
        description: 'Documents retrieved successfully',
        type: [UploadedDocumentResponseDto]
    })
    async getUserDocuments(@CurrentUser() user: AuthenticatedUser) {
        return this.uploadedServiceDocumentsService.findByUserId(user.accountId);
    }

    @Get('appointment/:appointmentId')
    @ApiOperation({ summary: 'Get all documents for a specific appointment' })
    @ApiResponse({
        status: 200,
        description: 'Documents retrieved successfully',
        type: [UploadedDocumentResponseDto]
    })
    async getAppointmentDocuments(
        @Param('appointmentId') appointmentId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.uploadedServiceDocumentsService.findByUserAndAppointment(
            user.accountId,
            appointmentId
        );
    }

    @Get('service/:serviceId')
    @ApiOperation({ summary: 'Get all documents for a specific service' })
    @ApiResponse({
        status: 200,
        description: 'Documents retrieved successfully',
        type: [UploadedDocumentResponseDto]
    })
    async getServiceDocuments(
        @Param('serviceId') serviceId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        const allServiceDocuments = await this.uploadedServiceDocumentsService.findByServiceId(serviceId);
        // Filter by current user for security
        return allServiceDocuments.filter(doc => doc.userId === user.accountId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get document details by ID' })
    @ApiResponse({
        status: 200,
        description: 'Document details retrieved successfully',
        type: UploadedDocumentResponseDto
    })
    @ApiResponse({ status: 404, description: 'Document not found' })
    async getDocument(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        const document = await this.uploadedServiceDocumentsService.findOne(id);

        // Ensure user can only access their own documents
        if (document.userId !== user.accountId) {
            throw new BadRequestException('Access denied');
        }

        return document;
    }

    @Get(':id/url')
    @ApiOperation({ summary: 'Get public URL for a document' })
    @ApiResponse({
        status: 200,
        description: 'Document URL retrieved successfully',
        type: DocumentUrlResponseDto
    })
    async getDocumentUrl(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        const document = await this.uploadedServiceDocumentsService.findOne(id);

        // Ensure user can only access their own documents
        if (document.userId !== user.accountId) {
            throw new BadRequestException('Access denied');
        }

        const url = await this.uploadedServiceDocumentsService.getFileUrl(id);
        return { url };
    }

    @Get(':id/download')
    @ApiOperation({ summary: 'Download a document' })
    @ApiResponse({ status: 200, description: 'Document downloaded successfully' })
    async downloadDocument(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
        @Res({ passthrough: true }) res: Response,
    ) {
        const document = await this.uploadedServiceDocumentsService.findOne(id);

        // Ensure user can only access their own documents
        if (document.userId !== user.accountId) {
            throw new BadRequestException('Access denied');
        }

        const fileData = await this.uploadedServiceDocumentsService.downloadFile(id);

        res.set({
            'Content-Type': fileData.contentType,
            'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
        });

        return new StreamableFile(Buffer.from(await fileData.data.arrayBuffer()));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a document' })
    @ApiResponse({
        status: 200,
        description: 'Document deleted successfully',
        type: DeleteResponseDto
    })
    @ApiResponse({ status: 404, description: 'Document not found' })
    async deleteDocument(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        const document = await this.uploadedServiceDocumentsService.findOne(id);

        // Ensure user can only delete their own documents
        if (document.userId !== user.accountId) {
            throw new BadRequestException('Access denied');
        }

        const deleted = await this.uploadedServiceDocumentsService.delete(id);
        return { success: deleted };
    }

    @Delete('appointment/:appointmentId')
    @ApiOperation({ summary: 'Delete all documents for an appointment' })
    @ApiResponse({
        status: 200,
        description: 'Documents deleted successfully',
        type: DeleteMultipleResponseDto
    })
    async deleteAppointmentDocuments(
        @Param('appointmentId') appointmentId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        // Get documents to verify ownership
        const documents = await this.uploadedServiceDocumentsService.findByUserAndAppointment(
            user.accountId,
            appointmentId
        );

        if (documents.length === 0) {
            return { deletedCount: 0 };
        }

        // Delete each document individually to ensure proper ownership checks
        let deletedCount = 0;
        for (const document of documents) {
            try {
                await this.uploadedServiceDocumentsService.delete(document.id);
                deletedCount++;
            } catch (error) {
                console.error(`Failed to delete document ${document.id}:`, error.message);
            }
        }

        return { deletedCount };
    }
}
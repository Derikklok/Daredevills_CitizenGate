import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UploadDocumentDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'File to upload (max 10MB)',
        example: 'file.pdf'
    })
    file: Express.Multer.File;

    @ApiProperty({
        description: 'Government service ID',
        example: 'f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30'
    })
    @IsUUID()
    @IsNotEmpty()
    serviceId: string;

    @ApiProperty({
        description: 'Required document ID',
        example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6'
    })
    @IsUUID()
    @IsNotEmpty()
    requiredDocumentId: string;

    @ApiProperty({
        description: 'Appointment ID',
        example: 'b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7'
    })
    @IsUUID()
    @IsNotEmpty()
    appointmentId: string;
}

export class UploadMultipleDocumentsDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary'
        },
        description: 'Multiple files to upload (max 10MB each)',
    })
    files: Express.Multer.File[];

    @ApiProperty({
        description: 'Government service ID',
        example: 'f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30'
    })
    @IsUUID()
    @IsNotEmpty()
    serviceId: string;

    @ApiProperty({
        description: 'Required document IDs (comma-separated)',
        example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6,b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7'
    })
    @IsString()
    @IsNotEmpty()
    requiredDocumentIds: string;

    @ApiProperty({
        description: 'Appointment ID',
        example: 'b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7'
    })
    @IsUUID()
    @IsNotEmpty()
    appointmentId: string;
}

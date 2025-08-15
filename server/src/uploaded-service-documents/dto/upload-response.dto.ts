import { ApiProperty } from '@nestjs/swagger';

export class UploadedDocumentResponseDto {
    @ApiProperty({
        description: 'Document ID',
        example: 'f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30'
    })
    id: string;

    @ApiProperty({
        description: 'S3 storage key',
        example: 'user123/appointment456/documents/f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30.pdf'
    })
    s3Key: string;

    @ApiProperty({
        description: 'Original file name',
        example: 'birth_certificate.pdf'
    })
    fileName: string;

    @ApiProperty({
        description: 'File MIME type',
        example: 'application/pdf'
    })
    fileType: string;

    @ApiProperty({
        description: 'Government service ID',
        example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6'
    })
    serviceId: string;

    @ApiProperty({
        description: 'Required document ID',
        example: 'b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7'
    })
    requiredDocumentId: string;

    @ApiProperty({
        description: 'User ID',
        example: 'user_123456789'
    })
    userId: string;

    @ApiProperty({
        description: 'Appointment ID',
        example: 'c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8'
    })
    appointmentId: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-08-15T10:30:00Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-08-15T10:30:00Z'
    })
    updatedAt: Date;
}

export class UploadMultipleResponseDto {
    @ApiProperty({
        description: 'Upload success status',
        example: true
    })
    success: boolean;

    @ApiProperty({
        description: 'Number of documents uploaded',
        example: 3
    })
    uploadedCount: number;

    @ApiProperty({
        description: 'List of uploaded documents',
        type: [UploadedDocumentResponseDto]
    })
    documents: UploadedDocumentResponseDto[];
}

export class DocumentUrlResponseDto {
    @ApiProperty({
        description: 'Public URL for the document',
        example: 'https://supabase.storage.url/bucket/user123/appointment456/documents/file.pdf'
    })
    url: string;
}

export class DeleteResponseDto {
    @ApiProperty({
        description: 'Deletion success status',
        example: true
    })
    success: boolean;
}

export class DeleteMultipleResponseDto {
    @ApiProperty({
        description: 'Number of documents deleted',
        example: 3
    })
    deletedCount: number;
}

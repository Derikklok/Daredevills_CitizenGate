import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AddAppointmentDocumentDto {
    @ApiProperty({ description: 'Required document ID', example: 'f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30' })
    @IsUUID()
    document_id: string;

    @ApiProperty({ description: 'Document name', example: 'Birth Certificate' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'File URL', example: 'https://storage.example.com/documents/birth-cert.jpg' })
    @IsString()
    file_url: string;
}



import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AppointmentDocumentDto {
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

export class CreateAppointmentDto {
    @ApiProperty({ description: 'Service ID for the appointment', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
    @IsUUID()
    service_id: string;

    @ApiProperty({ description: 'Availability ID for the chosen time slot', example: '2c1a5f16-abcd-4f1e-9c12-33f4d2b1a0bc' })
    @IsUUID()
    availability_id: string;

    @ApiProperty({ description: 'Full name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({ description: 'NIC', example: '123456789V' })
    @IsString()
    @IsNotEmpty()
    nic: string;

    @ApiProperty({ description: 'Phone number', example: '+94 77 123 4567' })
    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @ApiPropertyOptional({ description: 'Address', example: '123 Main St' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ description: 'Birth date (YYYY-MM-DD)', example: '1990-01-01' })
    @IsDateString()
    birth_date: string;

    @ApiProperty({ description: 'Gender', example: 'Male' })
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiPropertyOptional({ description: 'Email', example: 'john@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Appointment time (ISO 8601)', example: '2025-08-15T10:30:00Z' })
    @IsDateString()
    appointment_time: string;

    @ApiPropertyOptional({ description: 'Notes', example: 'First-time application' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Documents submitted with the appointment',
        type: [AppointmentDocumentDto],
        required: false,
    })
    @ValidateNested({ each: true })
    @Type(() => AppointmentDocumentDto)
    @IsArray()
    @IsOptional()
    documents_submitted?: AppointmentDocumentDto[];
}



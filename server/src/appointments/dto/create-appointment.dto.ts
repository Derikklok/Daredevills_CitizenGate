<<<<<<< HEAD
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DocumentSubmissionDto {
  @ApiProperty({ description: 'ID of the required document', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @IsUUID()
  document_id: string;

  @ApiProperty({ description: 'Name of the document', example: 'Passport' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL to the uploaded file', example: 'https://storage.example.com/documents/passport.pdf' })
  @IsString()
  file_url: string;
}

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Government service ID', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @ApiProperty({ description: 'Service availability ID', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @IsUUID()
  @IsNotEmpty()
  availability_id: string;

  @ApiProperty({ description: 'Full name of the applicant', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ description: 'National ID Card number', example: '123456789V' })
  @IsString()
  @IsNotEmpty()
  nic: string;

  @ApiProperty({ description: 'Phone number', example: '+94 77 123 4567' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiPropertyOptional({ description: 'Residential address', example: '123 Main St' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Date of birth', example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({ description: 'Gender', example: 'Male' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Username of the logged-in user creating the appointment', example: 'john_doe' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Appointment time', example: '2025-08-15T10:30:00Z' })
  @IsDateString()
  @IsNotEmpty()
  appointment_time: Date;

  @ApiPropertyOptional({ description: 'Additional notes', example: 'First-time application' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Documents submitted with the appointment', type: [DocumentSubmissionDto] })
  @IsArray()
  @IsOptional()
  documents_submitted?: DocumentSubmissionDto[];
}
=======
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedServiceDocuments } from 'src/uploaded-service-documents/uploaded-service-documents.entity';

export class CreateAppointmentDto {
    @ApiProperty({ description: 'Service ID for the appointment', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
    @IsUUID()
    service_id: string;

    @ApiProperty({ description: 'Availability ID for the chosen time slot', example: '2c1a5f16-abcd-4f1e-9c12-33f4d2b1a0bc' })
    @IsUUID()
    @IsOptional()
    availability_id: string;

    @ApiProperty({ description: 'Full name', example: 'John Doe' })
    @IsString()
    @IsOptional()
    full_name?: string;

    @ApiProperty({ description: 'NIC', example: '123456789V' })
    @IsString()
    @IsOptional()
    nic?: string;

    @ApiProperty({ description: 'Phone number', example: '+94 77 123 4567' })
    @IsString()
    @IsOptional()
    phone_number?: string;

    @ApiPropertyOptional({ description: 'Address', example: '123 Main St' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ description: 'Birth date (YYYY-MM-DD)', example: '1990-01-01' })
    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @ApiProperty({ description: 'Gender', example: 'Male' })
    @IsString()
    @IsOptional()
    gender?: string;

    @ApiPropertyOptional({ description: 'Email', example: 'john@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Appointment time (ISO 8601)', example: '2025-08-15T10:30:00Z' })
    @IsDateString()
    @IsOptional()
    appointment_time?: string;

    @ApiPropertyOptional({ description: 'Notes', example: 'First-time application' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Documents submitted with the appointment',
        type: [UploadedServiceDocuments],
        required: false,
    })
    @ValidateNested({ each: true })
    @Type(() => UploadedServiceDocuments)
    @IsArray()
    @IsOptional()
    documents_submitted?: UploadedServiceDocuments[];
}


>>>>>>> master

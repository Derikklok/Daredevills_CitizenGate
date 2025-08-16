import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompleteAppointmentDto {
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
}

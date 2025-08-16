import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateDraftAppointmentDto {
    @ApiPropertyOptional({ description: 'Service ID for the appointment', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
    @IsUUID()
    @IsOptional()
    service_id?: string;

    @ApiPropertyOptional({ description: 'Availability ID for the chosen time slot', example: '2c1a5f16-abcd-4f1e-9c12-33f4d2b1a0bc' })
    @IsUUID()
    @IsOptional()
    availability_id?: string;

    @ApiPropertyOptional({ description: 'User ID from authentication (optional - extracted from token)', example: 'user_123456789' })
    @IsString()
    @IsOptional()
    user_id?: string;
}

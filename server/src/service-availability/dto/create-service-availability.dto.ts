import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateServiceAvailabilityDto {
    @ApiProperty({ description: 'Service ID this availability belongs to', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
    @IsUUID()
    service_id: string;

    @ApiProperty({ description: 'Day of the week', example: 'Monday' })
    @IsString()
    @IsNotEmpty()
    day_of_week: string;

    @ApiProperty({ description: 'Start time (HH:mm)', example: '09:00' })
    @IsString()
    @IsNotEmpty()
    start_time: string;

    @ApiProperty({ description: 'End time (HH:mm)', example: '17:00' })
    @IsString()
    @IsNotEmpty()
    end_time: string;

    @ApiProperty({ description: 'Duration in minutes', example: 30 })
    @IsInt()
    @Min(1)
    duration_minutes: number;
}

export class CreateServiceAvailabilityMultipleDaysDto {
    @ApiProperty({ description: 'Service ID this availability belongs to', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
    @IsUUID()
    service_id: string;

    @ApiProperty({ description: 'Days of the week', example: ['Monday', 'Wednesday', 'Friday'], isArray: true, type: String })
    @IsString({ each: true })
    days_of_week: string[];

    @ApiProperty({ description: 'Start time (HH:mm)', example: '09:00' })
    @IsString()
    @IsNotEmpty()
    start_time: string;

    @ApiProperty({ description: 'End time (HH:mm)', example: '17:00' })
    @IsString()
    @IsNotEmpty()
    end_time: string;

    @ApiProperty({ description: 'Duration in minutes', example: 30 })
    @IsInt()
    @Min(1)
    duration_minutes: number;
}



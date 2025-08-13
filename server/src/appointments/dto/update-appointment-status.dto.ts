import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateAppointmentStatusDto {
    @ApiProperty({ enum: ['pending', 'confirmed', 'completed', 'cancelled'] })
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'] as const)
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}



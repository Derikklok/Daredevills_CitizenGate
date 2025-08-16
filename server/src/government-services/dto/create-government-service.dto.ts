import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateGovernmentServiceDto {
    @ApiProperty({ description: 'Name of the government service', example: 'Passport Renewal' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'Detailed description of the service', example: 'Renew your passport at the nearest office.' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Department ID that owns this service', example: 1, minimum: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    department_id?: number;

    @ApiPropertyOptional({ description: 'Category of the service', example: 'Travel' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Estimated time to complete the service', example: '3-5 business days' })
    @IsString()
    @IsOptional()
    estimated_total_completion_time?: string;
}



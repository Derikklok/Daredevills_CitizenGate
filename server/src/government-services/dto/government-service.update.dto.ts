import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GovernmentServiceUpdateDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The name of the government service',
        example: 'Government Service',
        required: false,
    })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The description of the government service',
        example: 'This is a government service',
        required: false,
    })
    description?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The category of the government service',
        examples: ['Health', 'Education', 'Finance', 'Transportation', 'Other'],
        required: false,
    })
    category?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The estimated total completion time of the government service',
        example: '1 hour',
        required: false,
    })
    estimated_total_completion_time?: string;
}
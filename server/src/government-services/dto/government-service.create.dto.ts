import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class GovernmentServiceCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of the government service',
        example: 'Government Service',
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The description of the government service',
        example: 'This is a government service',
    })
    description: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The ID of the department in the Clerk Organization. This is done because clerk is handling the organization and department data.',
        example: 'org_31Ctzo7oY6NUu5H6IylPKCfwXVt',
    })
    department_id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The category of the government service',
        examples: ['Health', 'Education', 'Finance', 'Transportation', 'Other'],
    })
    category: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The estimated total completion time of the government service',
        example: '1 hour',
    })
    estimated_total_completion_time: string;
}
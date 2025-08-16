import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterGovernmentServicesDto {
  @ApiPropertyOptional({ description: 'Filter services by name (case-insensitive)', example: 'passport' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter services by department ID', example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  department_id?: number;
}

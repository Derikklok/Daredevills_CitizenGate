import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterAppointmentsDto {
  @ApiPropertyOptional({ description: 'Filter by department ID' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  department_id?: number;

  @ApiPropertyOptional({ description: 'Filter by service ID' })
  @IsOptional()
  @IsString()
  service_id?: string;

  @ApiPropertyOptional({ description: 'Filter by NIC number' })
  @IsOptional()
  @IsString()
  nic?: string;

  @ApiPropertyOptional({ description: 'Filter by username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'Filter by appointment status', example: 'pending' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  date?: string;
}

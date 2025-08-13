import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRequiredDocumentDto {
    @ApiProperty({ description: 'Service ID this document belongs to', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
    @IsUUID()
    service_id: string;

    @ApiProperty({ description: 'Name of the required document', example: 'Birth Certificate' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'Description of the required document', example: 'Original or certified copy.' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Whether this document is mandatory', example: true, default: true })
    @IsBoolean()
    @IsOptional()
    is_mandatory?: boolean;

    @ApiPropertyOptional({ description: 'Allowed upload formats', example: 'pdf,jpg,png', default: 'pdf,jpg,png' })
    @IsString()
    @IsOptional()
    document_format?: string;
}



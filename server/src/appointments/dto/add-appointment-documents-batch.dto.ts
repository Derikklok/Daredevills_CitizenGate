import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { AddAppointmentDocumentDto } from './add-appointment-document.dto';

export class AddAppointmentDocumentsBatchDto {
    @ApiProperty({ type: [AddAppointmentDocumentDto] })
    @ValidateNested({ each: true })
    @Type(() => AddAppointmentDocumentDto)
    @IsArray()
    documents: AddAppointmentDocumentDto[];
}



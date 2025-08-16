import { PartialType } from '@nestjs/swagger';
import { CreateRequiredDocumentDto } from './create-required-document.dto';

export class UpdateRequiredDocumentDto extends PartialType(CreateRequiredDocumentDto) { }



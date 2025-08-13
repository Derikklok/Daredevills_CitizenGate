import { PartialType } from '@nestjs/swagger';
import { CreateGovernmentServiceDto } from './create-government-service.dto';

export class UpdateGovernmentServiceDto extends PartialType(CreateGovernmentServiceDto) { }



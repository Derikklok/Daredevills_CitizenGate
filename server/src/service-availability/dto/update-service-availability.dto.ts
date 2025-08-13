import { PartialType } from '@nestjs/swagger';
import { CreateServiceAvailabilityDto } from './create-service-availability.dto';

export class UpdateServiceAvailabilityDto extends PartialType(CreateServiceAvailabilityDto) { }



import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAvailabilityService } from './service-availability.service';

describe('ServiceAvailabilityService', () => {
  let service: ServiceAvailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceAvailabilityService],
    }).compile();

    service = module.get<ServiceAvailabilityService>(ServiceAvailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GovernmentServicesService } from './government-services.service';

describe('GovernmentServicesService', () => {
  let service: GovernmentServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GovernmentServicesService],
    }).compile();

    service = module.get<GovernmentServicesService>(GovernmentServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

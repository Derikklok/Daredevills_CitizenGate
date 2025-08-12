import { Test, TestingModule } from '@nestjs/testing';
import { SystemAdminService } from './system-admin.service';

describe('SystemAdminService', () => {
  let service: SystemAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemAdminService],
    }).compile();

    service = module.get<SystemAdminService>(SystemAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RequiredDocumentsService } from './required-documents.service';

describe('RequiredDocumentsService', () => {
  let service: RequiredDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequiredDocumentsService],
    }).compile();

    service = module.get<RequiredDocumentsService>(RequiredDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

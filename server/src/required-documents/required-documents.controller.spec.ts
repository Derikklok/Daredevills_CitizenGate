import { Test, TestingModule } from '@nestjs/testing';
import { RequiredDocumentsController } from './required-documents.controller';

describe('RequiredDocumentsController', () => {
  let controller: RequiredDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequiredDocumentsController],
    }).compile();

    controller = module.get<RequiredDocumentsController>(RequiredDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

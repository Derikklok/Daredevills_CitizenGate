import { Test, TestingModule } from '@nestjs/testing';
import { SystemAdminController } from './system-admin.controller';

describe('SystemAdminController', () => {
  let controller: SystemAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemAdminController],
    }).compile();

    controller = module.get<SystemAdminController>(SystemAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

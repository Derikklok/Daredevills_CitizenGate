import { Test, TestingModule } from '@nestjs/testing';
import { GovernmentServicesController } from './government-services.controller';

describe('GovernmentServicesController', () => {
  let controller: GovernmentServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovernmentServicesController],
    }).compile();

    controller = module.get<GovernmentServicesController>(GovernmentServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAvailabilityController } from './service-availability.controller';

describe('ServiceAvailabilityController', () => {
  let controller: ServiceAvailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAvailabilityController],
    }).compile();

    controller = module.get<ServiceAvailabilityController>(ServiceAvailabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

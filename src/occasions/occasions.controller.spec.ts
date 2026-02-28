import { Test, TestingModule } from '@nestjs/testing';
import { OccasionsController } from './occasions.controller';
import { OccasionsService } from './occasions.service';

describe('OccasionsController', () => {
  let controller: OccasionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccasionsController],
      providers: [OccasionsService],
    }).compile();

    controller = module.get<OccasionsController>(OccasionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StpController } from './stp.controller';
import { StpService } from './stp.service';

describe('StpController', () => {
  let controller: StpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StpController],
      providers: [StpService],
    }).compile();

    controller = module.get<StpController>(StpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

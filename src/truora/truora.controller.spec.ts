import { Test, TestingModule } from '@nestjs/testing';
import { TruoraController } from './truora.controller';
import { TruoraService } from './truora.service';

describe('TruoraController', () => {
  let controller: TruoraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TruoraController],
      providers: [TruoraService],
    }).compile();

    controller = module.get<TruoraController>(TruoraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

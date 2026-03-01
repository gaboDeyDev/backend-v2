import { Test, TestingModule } from '@nestjs/testing';
import { CooperativoController } from './cooperativo.controller';
import { CooperativoService } from './cooperativo.service';

describe('CooperativoController', () => {
  let controller: CooperativoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CooperativoController],
      providers: [CooperativoService],
    }).compile();

    controller = module.get<CooperativoController>(CooperativoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

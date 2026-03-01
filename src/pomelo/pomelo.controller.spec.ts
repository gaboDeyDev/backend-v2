import { Test, TestingModule } from '@nestjs/testing';
import { PomeloController } from './pomelo.controller';
import { PomeloService } from './pomelo.service';

describe('PomeloController', () => {
  let controller: PomeloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PomeloController],
      providers: [PomeloService],
    }).compile();

    controller = module.get<PomeloController>(PomeloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PomeloService } from './pomelo.service';

describe('PomeloService', () => {
  let service: PomeloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PomeloService],
    }).compile();

    service = module.get<PomeloService>(PomeloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

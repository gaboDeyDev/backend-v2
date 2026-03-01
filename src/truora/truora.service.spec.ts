import { Test, TestingModule } from '@nestjs/testing';
import { TruoraService } from './truora.service';

describe('TruoraService', () => {
  let service: TruoraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TruoraService],
    }).compile();

    service = module.get<TruoraService>(TruoraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

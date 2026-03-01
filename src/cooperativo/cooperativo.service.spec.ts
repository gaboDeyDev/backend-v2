import { Test, TestingModule } from '@nestjs/testing';
import { CooperativoService } from './cooperativo.service';

describe('CooperativoService', () => {
  let service: CooperativoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CooperativoService],
    }).compile();

    service = module.get<CooperativoService>(CooperativoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

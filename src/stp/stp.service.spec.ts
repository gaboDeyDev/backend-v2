import { Test, TestingModule } from '@nestjs/testing';
import { StpService } from './stp.service';

describe('StpService', () => {
  let service: StpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StpService],
    }).compile();

    service = module.get<StpService>(StpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

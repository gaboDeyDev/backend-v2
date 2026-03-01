import { Test, TestingModule } from '@nestjs/testing';
import { WebhookStpService } from './webhook-stp.service';

describe('WebhookStpService', () => {
  let service: WebhookStpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookStpService],
    }).compile();

    service = module.get<WebhookStpService>(WebhookStpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

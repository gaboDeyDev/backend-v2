import { Test, TestingModule } from '@nestjs/testing';
import { WebhookStpController } from './webhook-stp.controller';
import { WebhookStpService } from './webhook-stp.service';

describe('WebhookStpController', () => {
  let controller: WebhookStpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookStpController],
      providers: [WebhookStpService],
    }).compile();

    controller = module.get<WebhookStpController>(WebhookStpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

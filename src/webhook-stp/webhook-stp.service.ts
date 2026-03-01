import { Injectable } from '@nestjs/common';
import { CreateWebhookStpDto } from './dto/create-webhook-stp.dto';
import { UpdateWebhookStpDto } from './dto/update-webhook-stp.dto';

@Injectable()
export class WebhookStpService {
  create(createWebhookStpDto: CreateWebhookStpDto) {
    return 'This action adds a new webhookStp';
  }

  findAll() {
    return `This action returns all webhookStp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} webhookStp`;
  }

  update(id: number, updateWebhookStpDto: UpdateWebhookStpDto) {
    return `This action updates a #${id} webhookStp`;
  }

  remove(id: number) {
    return `This action removes a #${id} webhookStp`;
  }
}

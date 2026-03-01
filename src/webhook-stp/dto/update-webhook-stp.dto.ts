import { PartialType } from '@nestjs/mapped-types';
import { CreateWebhookStpDto } from './create-webhook-stp.dto';

export class UpdateWebhookStpDto extends PartialType(CreateWebhookStpDto) {}

import { Module } from '@nestjs/common';
import { WebhookStpService } from './webhook-stp.service';
import { WebhookStpController } from './webhook-stp.controller';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { CustomerModule } from 'src/customer/customer.module';
import { UserVerifiedService } from 'src/customer/services/user-verified.service';
import { NotificationsService } from 'src/customer/services/notofocations-service';
import { KycserviceService } from 'src/customer/services/kycservice.service';
import { HttpModule } from '@nestjs/axios';
import { StpModule } from 'src/stp/stp.module';

@Module({
  imports: [CustomerModule, HttpModule, StpModule],
  controllers: [WebhookStpController, ],
  providers: [WebhookStpService, PomeloService, UserVerifiedService, NotificationsService, KycserviceService],
})
export class WebhookStpModule {}

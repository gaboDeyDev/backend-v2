import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { UserVerifiedService } from 'src/customer/services/user-verified.service';
import { NotificationsService } from 'src/customer/services/notofocations-service';
import { KycserviceService } from 'src/customer/services/kycservice.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CustomerModule } from 'src/customer/customer.module';
import { StpModule } from 'src/stp/stp.module';

@Module({
  imports: [HttpModule, CustomerModule, StpModule],
  controllers: [CreditController],
  providers: [CreditService, PomeloService, UserVerifiedService, NotificationsService, KycserviceService],
})
export class CreditModule {}

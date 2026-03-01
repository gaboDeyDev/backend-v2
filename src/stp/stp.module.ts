import { forwardRef, Module } from '@nestjs/common';
import { StpService } from './stp.service';
import { StpController } from './stp.controller';
import { TransactionsService } from 'src/transactions/transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DecimalOperations } from 'src/utils/decimalHelpers/decimalOperations';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { CustomerModule } from 'src/customer/customer.module';
import { UserVerifiedService } from 'src/customer/services/user-verified.service';
import { NotificationsService } from 'src/customer/services/notofocations-service';
import { KycserviceService } from 'src/customer/services/kycservice.service';

@Module({
  imports: [HttpModule, forwardRef(() => CustomerModule)],
  controllers: [StpController],
  providers: [StpService, TransactionsService, PrismaService, DecimalOperations, PomeloService, UserVerifiedService, NotificationsService, KycserviceService],
  exports: [StpService],
})
export class StpModule { }

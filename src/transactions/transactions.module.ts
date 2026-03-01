import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DecimalOperations } from 'src/utils/decimalHelpers/decimalOperations';
import { CustomerModule } from 'src/customer/customer.module';
import { UserVerifiedService } from 'src/customer/services/user-verified.service';
import { NotificationsService } from 'src/customer/services/notofocations-service';
import { HttpModule } from '@nestjs/axios';
import { KycserviceService } from 'src/customer/services/kycservice.service';
import { PomeloModule } from 'src/pomelo/pomelo.module';

@Module({
  imports: [HttpModule, CustomerModule, PomeloModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, DecimalOperations, UserVerifiedService, NotificationsService, KycserviceService],
})
export class TransactionsModule { }

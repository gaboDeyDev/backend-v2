import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './customer.controller';
import { UserService } from './services/user.service';
import { NotificationsService } from './services/notofocations-service';
import { KycserviceService } from './services/kycservice.service';
import { UserVerifiedService } from './services/user-verified.service';
import { HttpModule } from '@nestjs/axios';
import { TempCodeService } from './services/temp-code.service';
import { scoreVerificationService } from './services/score-verification.service';
import { CreditCircleAuditService } from './services/credit-circle-audit.service';
import { CreditAssignmentService } from './services/credit-assignment.service';
import { TruoraService } from './services/truora.service';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { StpModule } from 'src/stp/stp.module';
import { AccountModule } from 'src/account/account.module';
import { UserCustomerService } from './services/user_customer.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    forwardRef(() => StpModule),
    AccountModule,
    AuthModule,
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService, 
    UserService, 
    NotificationsService, 
    KycserviceService, 
    UserVerifiedService, 
    TempCodeService, 
    scoreVerificationService, 
    CreditCircleAuditService,
    CreditAssignmentService,
    TruoraService,
    PomeloService,
    UserCustomerService
  ],
  exports: [UserService, UserVerifiedService, TempCodeService, CreditAssignmentService, TruoraService],
})
export class CustomerModule { }

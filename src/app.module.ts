import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { CreditModule } from './credit/credit.module';
import { AccountModule } from './account/account.module';
import { ListItemModule } from './list-item/list-item.module';
import { TransactionsModule } from './transactions/transactions.module';
import { StpModule } from './stp/stp.module';
import { WebhookStpModule } from './webhook-stp/webhook-stp.module';
import { CooperativoModule } from './cooperativo/cooperativo.module';
// import { CooperativoModule } from './cooperativo/cooperativo.module';
import { HealthModule } from './health/health.module';
import { UndostresModule } from './undostres/undostres.module';
import { SecretsManagerModule } from './secrets_manager/secrets_manager.module';
import { ConfigModule } from '@nestjs/config';
import { TruoraModule } from './truora/truora.module';
import { BackofficeModule } from './backoffice/backoffice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CustomerModule,
    AuthModule,
    CreditModule,
    AccountModule,
    ListItemModule,
    TransactionsModule,
    StpModule,
    WebhookStpModule,
    CooperativoModule,
    HealthModule,
    UndostresModule.init(),
    SecretsManagerModule,
    TruoraModule,
    BackofficeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

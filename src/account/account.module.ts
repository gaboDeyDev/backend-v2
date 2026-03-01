import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { AccountRepository } from './repository/account.repository';
// import { VerificationRepository } from './repository/verification.repository';
// import { CodeRepository } from './repository/code.repository';
// import { CustomerRepository } from './repository/customer.repository';
// import { RegistrationProcedureRepository } from './repository/registration_procedure.repository';
// import { SessionRepository } from './repository/session.repository';
// import { LoginService } from './login.service';
import { GenerateTokenService } from './generate_token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      signOptions: {
        audience: 'dey',
        algorithm: 'HS512',
      },
    }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    // AccountRepository,
    // VerificationRepository,
    // CodeRepository,
    // CustomerRepository,
    // RegistrationProcedureRepository,
    // SessionRepository,
    // LoginService,
    GenerateTokenService,
  ],
  exports: [
    // VerificationRepository,
    // CodeRepository,
    // CustomerRepository,
    // RegistrationProcedureRepository,
    // SessionRepository,
    // LoginService,
  ],
})
export class AccountModule {}

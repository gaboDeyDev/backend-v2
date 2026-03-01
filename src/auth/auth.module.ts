import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './jwt.service';
import { JwtAuthGuard } from './guards/jwt.guard';
// import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRES_IN') || 86400,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtAuthGuard],
  exports: [JwtTokenService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}

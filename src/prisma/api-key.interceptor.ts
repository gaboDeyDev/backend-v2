import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class ApiKeyInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    // Permitir acceso sin validar API Key para /customer/login

    if (
      req.path === '/customer/login' ||
      req.path.includes('/customer/verify-email-register') ||
      req.path.includes('/customer/send-otp-recover') ||
      req.path.includes('/customer/kyc-status') ||
      req.path.includes('/customer/sign-up') ||
      req.path.includes('/customer/send-otp') ||
      req.path.includes('/customer/reset-password') ||
      req.path.includes('/customer/verify-otp') ||
      req.path.includes('/customer/getUserSalay') ||
      req.path.includes('/customer/acept-proposa') ||
      req.path.includes('/credit/verify-identit')
    ) {
      return next.handle();
    }
    console.log('Headers:', req.headers); // Agrega este log para depuración
    const apiKey = req.headers['x-api-key'];
    console.log('API Key:', apiKey); // Agrega este log para depuración
    if (!apiKey) {
      throw new UnauthorizedException('API Key header missing');
    }
    // Busca el apiKey en la base de datos (ajusta el modelo y campo según tu esquema)
    // const keyExists = await this.prisma.user.findUnique({ where: { cognito_id: apiKey } });
    // console.log('Key exists:', keyExists); // Agrega este log para depuración
    // if (!keyExists) {
    //   throw new UnauthorizedException('Invalid API Key');
    // }
    return next.handle();
  }
}

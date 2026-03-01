import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { ApiKeyInterceptor } from './prisma/api-key.interceptor';
// import { PrismaService } from './prisma/prisma.service';
// import { ConfigService } from '@nestjs/config';

class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Intercepting request');
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    Logger.log(`Incoming Request: ${method} ${url}`, 'HTTP');
    return next
      .handle()
      .pipe(
        tap(() => Logger.log(`Response sent for: ${method} ${url}`, 'HTTP')),
      );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Starting application');
  // const prisma = app.get(PrismaService);
  app.useGlobalInterceptors(
    // new ApiKeyInterceptor(prisma),
    new LoggingInterceptor(),
  );
  const port = process.env.PORT ?? 3000;
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  await app.listen(port);
  console.log(`Application is running on port : ${port}`);
  Logger.log(`Application listening on port ${port}`, 'Bootstrap');
}
bootstrap();

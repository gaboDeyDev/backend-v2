import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';

@Injectable()
export class TokenCreatorInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      mergeMap(async data => {

        const accessToken = '';
        const refreshToken = '';

        return { ...data , tokens: { access: accessToken, refresh: refreshToken } };

      })
    );
  }
}

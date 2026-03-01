import { CallHandler, ExecutionContext, ForbiddenException, Inject, Injectable, NestInterceptor, Optional } from '@nestjs/common';
import { Observable } from 'rxjs';
// import { GetAccountSessionService } from 'src/account/get_account_session.service';

@Injectable()
export class UserDataInterceptor implements NestInterceptor {

  constructor(){}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();

    const { user } = request;

    if(!user) throw new ForbiddenException('Invalid credentials');

    const userData = {}; // await this.sessionService.ofSession(payload.sessionID, 'BASIC');

    request.user['data'] = userData;

    return next.handle();
  }
}

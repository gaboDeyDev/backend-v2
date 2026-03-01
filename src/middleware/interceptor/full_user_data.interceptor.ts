// import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';
// // import { GetAccountSessionService } from 'src/account/get_account_session.service';

// @Injectable()
// export class FullUserDataInterceptor implements NestInterceptor {

//   constructor(private readonly sessionService: GetAccountSessionService){}

//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

//     const request = context.switchToHttp().getRequest();
    
//     const { user } = request;

//     if(!user) throw new ForbiddenException('Invalid credentials');

//     const pattern = { action: 'full-read', topic: 'account' };

//     const payload = {
//       sessionID: user.sessionID
//     };

//     const userData = await this.sessionService.ofSession(payload.sessionID, 'FULL');
    
//     request.user['data'] = userData;

//     return next.handle();
//   }
// }

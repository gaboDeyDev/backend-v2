// import { BadRequestException, Injectable } from '@nestjs/common';
// import { AccountKeysDto } from './model/account_keys.dto';
// import { AccountRepository } from './repository/account.repository';
// import { SessionRepository } from './repository/session.repository';
// import { ValidationAccountModel } from './model/validation_account.model';
// import passwordValidation from './fx/password_validation';
// import dateByExpression from '../utils/date_by_expression';
// import { GenerateTokenService } from './generate_token.service';
import { ConfigService } from '@nestjs/config';


// @Injectable()
// export class LoginService {

//     private maxTimeSession: string;


//     constructor(
//         private readonly accountRepository: AccountRepository,
//         private readonly sessionRepository: SessionRepository,
//         private readonly tokenGeneratorService: GenerateTokenService
//     ) {
//         this.maxTimeSession = process.env.MAX_TIME_SESSION || '15m';
//     }

//     async signWith({ email, password }: AccountKeysDto){
//         const validation = await this.validateAccount({ email, password });

//         const id = await this.validateSession(validation);

//         const userData = await this.accountRepository.findAccountById(id, 'customer');

//         if(!userData) throw new BadRequestException('account not found');

//         const tokenData = {
//             accountID: id,
//             userID: userData['customer'].id,
//             sessionID: validation.sessionID
//         }

//         const refreshTokenData = {
//             sessionID: validation.sessionID
//         }

//         const accessToken = await this.tokenGeneratorService.createToken('access', tokenData);
//         const refreshToken = await this.tokenGeneratorService.createToken('refresh', refreshTokenData);

//         return { tokens: { accessToken, refreshToken }, data: userData };
//     }

//     async validateAccount({ email, password }: AccountKeysDto){
//         const account = await this.accountRepository.findAccountByEmail(email, false);

//         if(!account) throw new BadRequestException('account not found');

//         if(!account.password) throw new BadRequestException('account not found');

//         const session = await this.sessionRepository.createSession(account.id, dateByExpression(this.maxTimeSession));
        
//         const isValid = passwordValidation(account.password, password);

//         return {
//             sessionID: session.id,
//             accountID: account.id,
//             isValid
//         }
//     }

//     async validateSession({ accountID, sessionID, isValid }: ValidationAccountModel){
//         if(isValid) return accountID;

//         if(sessionID){
//             await this.sessionRepository.incrementAttemptsOnSession(sessionID);
//             await this.sessionRepository.closeSession(sessionID);
//         } else {
//             await this.accountRepository.changeStatusAccount(accountID, isValid);
//         }

//         return accountID;
//     }

// }


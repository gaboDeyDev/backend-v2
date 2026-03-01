// import { BadGatewayException, ForbiddenException, Injectable } from '@nestjs/common';
// import { SessionRepository } from './repository/session.repository';
// import { AccessDataType } from './types/acccess_data.type';

// @Injectable()
// export class GetAccountSessionService {

//     constructor(
//         private readonly accessRepository: SessionRepository
//     ){}

//     async ofSession(id: string, type: AccessDataType = 'MINIMAL'){
//         const data = await this.accessRepository.getAccountSession(id, type);

//         if(!data) throw new BadGatewayException();
        
//         if(!data.active) throw new ForbiddenException('Session Closed');

//         if(!['ACTIVE', 'IN_PROGRESS'].includes(data['account'].status)) throw new ForbiddenException();

//         return data;
//     }
// }

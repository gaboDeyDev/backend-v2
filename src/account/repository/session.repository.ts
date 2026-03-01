// import { Injectable } from "@nestjs/common";
// import { Prisma } from "@dey/prisma/accounts";
// import { DefaultArgs } from "@dey/prisma/accounts/runtime/library";
// import createSessionQuery from "../query/session/create_session.query";
// import setStateAccountQuery from "../query/session/set_state_account.query";
// import incrementAttemptsQuery from "../query/session/increment_attempts.query";
// import closeSessionQuery from "../query/session/close_session.query";
// import getAccountSessionQuery from "../query/session/get_account_session_data";
// import { firstValueFrom, from, map } from "rxjs";
// import { AccountsPrismaService } from "src/prisma/accounts_prisma.service";
// import { AccessDataType } from "../types/acccess_data.type";

// @Injectable()
// export class SessionRepository {

//     private repository: Prisma.SessionDelegate<DefaultArgs, Prisma.PrismaClientOptions>;

//     constructor(
//         private readonly prismaService: AccountsPrismaService
//     ){
//         this.repository = prismaService.session;
//     }

//     async getAccountSession(id: string, type: AccessDataType = 'MINIMAL') {
//         const query = getAccountSessionQuery(id, type);

//         return await firstValueFrom(from(this.repository.findFirst(query as any)).
//             pipe(
//                 /*map(data => {
//                     if(type !== 'SENSITIVE' )
//                         return data;

//                     data.
//                 })*/
//             ));
//     }

//     async createSession(accountID: string, expiration: Date) {
//         const query = createSessionQuery(accountID, expiration);

//         return await this.repository.create({ data: query });
//     }

//     async invalidateSession(sessionID: string) {
//         const { where, data } = setStateAccountQuery(sessionID);

//         return await this.repository.update({ where: where as any, data: data as any });
//     }

//     async incrementAttemptsOnSession(sessionID: string) {

//         const { where, data } = incrementAttemptsQuery(sessionID);

//         return await this.repository.update({ where: where as any, data: data as any });
//     }

//     async closeSession(sessionID: string) {
//         const { where, data } = closeSessionQuery(sessionID);

//         return await this.repository.update({ where: where as any, data: data as any });
//     }

// }
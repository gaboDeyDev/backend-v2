
// import { Injectable } from "@nestjs/common";
// import { Prisma } from "@dey/prisma/accounts";
// import { DefaultArgs } from "@dey/prisma/accounts/runtime/library";

// import saveCodeQuery, { selectQuery } from "../query/codes/save_code.query";
// import { AccountsPrismaService } from "../../prisma/accounts_prisma.service";
// import { CodeType } from "../types/code.type";

// @Injectable()
// export class CodeRepository {

//     private repository: Prisma.CodesDelegate<DefaultArgs, Prisma.PrismaClientOptions>;

//     constructor(private prismaService:AccountsPrismaService){
//         this.repository = prismaService.codes;
//     }

//     // async saveCodeForVerification(value: string, code: string, type: CodeType) {
//         const data = saveCodeQuery({
//             value,
//             code,
//             expiration: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
//             subject: type
//         });

//         return await this.repository.create({data, select: selectQuery});
//     }

//     async verifyCode(id: string, code: string) {
//         return await this.prismaService.$transaction(async tx => {
            
//             const current = await tx.codes.findFirst({ where: { account: id.includes('@')? { email: id } : { id }, value: code, used: false } });

//             if(!current) return false;

//             if(current.expiresAt > new Date()) {
//                 return await tx.codes.update({ where: { id: current.id }, data: { used: true, success: true }, include: { account: { select: { id: true } } } });
//             }else {
//                 return await tx.codes.update({ where: { id: current.id }, data: { expired: true } });
//             }

//         });
//     }

// }
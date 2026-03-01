// import { AccountStatustype, Prisma } from "@dey/prisma/accounts";
// import { DefaultArgs } from "@dey/prisma/accounts/runtime/library";
// import findAccountQuery from '../query/find_account.query';
// import createAccountQuery from '../query/account/create_account.query';
// import { AccountType } from "../types/account.type";
// import { Injectable } from "@nestjs/common";
// import findAccountByIdQuery from "../query/account/get_account_logged.query";

// import updatePasswordQuery from "../query/account/update_password.query";
// import getAccountDataQuery from "../query/account/get_account_data.query";
// import { AccountsPrismaService } from "src/prisma/accounts_prisma.service";
// import { AccessDataType } from "../types/acccess_data.type";
// //import { ItemType } from "../types/item.type";

// @Injectable()
// export class AccountRepository {

//     private repository: Prisma.AccountDelegate<DefaultArgs, Prisma.PrismaClientOptions>;

//     constructor(
//         private readonly prismaService:AccountsPrismaService
//     ){
//         this.repository = prismaService.account;
//     }
    
//     async getAccountInformation(id: string, criteria: AccessDataType) {
//         const query = getAccountDataQuery(id, criteria);

//         return await this.repository.findFirst(query as any);
//     }

//     async updatePassword(id: string, password: string) {
//         const { where, data } = updatePasswordQuery(id, password);

//         return await this.repository.update({ where: where! as any, data: data! });
//     }

//     /*async validateItem(id: string, item: ItemType) {
        
//     }*/

//     async findAccountById(id: string, type: "customer" | "admin", userData: boolean = false) {
//         const { where, select, include } = findAccountByIdQuery(id, type, userData);

//         const params = userData ? { where: where! as any, include: include! as any } 
//             : { where: where! as any, select: select! as any };

//         return await this.repository.findFirst(params as any);
//     }

//     async changeStatusAccount(id: string, status: boolean) {
//         return await this.repository.update({ where: { id }, data: { active: status } });
//     }

//     async createAccount(data: AccountType) {
//         const accountdata = createAccountQuery(data);
    
//         return await this.repository.create({ data: accountdata });
//     }
    
//     async findAccountByEmail(email: string, admin: boolean) {
            
//         const where = findAccountQuery(email, admin);
            
//         return await this.repository.findFirst({ where });
//     }
        
//     async enableAccount(id: string, enable: boolean) {
    
//         const status: AccountStatustype = enable ? 'ACTIVE' : 'BLOCKED';
            
//         return await this.repository.update({ where: { id }, data: { status } });
//     }
        
//     async deleteAccount(id: string) {
//         return await this.repository.delete({ where: { id } });
//     }

// }
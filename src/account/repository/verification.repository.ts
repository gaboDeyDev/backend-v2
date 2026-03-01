// import { Injectable } from "@nestjs/common";
// import { DefaultArgs } from "@dey/prisma/accounts/runtime/library";
// import { Prisma } from "@dey/prisma/accounts";
// import getVerificationOfCustomerQuery from "../query/verification/get_verification_of_customer.query";
// import { AccountsPrismaService } from "src/prisma/accounts_prisma.service";
// import { VerificationProviderType } from "../types/verification_provider.type";

// @Injectable()
// export class VerificationRepository{

//     private repository: Prisma.VerificationDelegate<DefaultArgs, Prisma.PrismaClientOptions>;

//     constructor(
//         private readonly prismaService: AccountsPrismaService
//     ){
//         this.repository = prismaService.verification;
//     }

//     async getVerificationOfProvider(id: string, verification: VerificationProviderType): Promise<any> {
//         const query = getVerificationOfCustomerQuery(id, verification);

//         return await this.repository.findFirst(query as any);
        
//     }

// }
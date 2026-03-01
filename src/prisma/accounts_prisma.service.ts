// import { PrismaClient } from '@dey/prisma/accounts';
// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

// @Injectable()
// export class AccountsPrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor() {
//     super({
//       datasourceUrl: process.env.ACCOUNT_DATABASE_URL!,
//       transactionOptions: {
//         maxWait: 50000,
//         timeout: 120000,
//       },
//     });
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }

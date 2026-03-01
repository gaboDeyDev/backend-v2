// import { Prisma, PrismaClient } from "@dey/prisma/accounts"
// import { DefaultArgs } from "@dey/prisma/accounts/runtime/library";

// export type Account = Prisma.AccountDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
// export type Customer = Prisma.CustomerDelegate<DefaultArgs, Prisma.PrismaClientOptions>;


// export type EntityType = Exclude<keyof PrismaClient, `$${string}`>;

// export type ModelDelegate<T extends keyof PrismaClient> = PrismaClient[T] & {
//   findMany: (...args: any[]) => Promise<any>;
//   count: (...args: any[]) => Promise<number>;
// };
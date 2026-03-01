// import { Prisma } from "@dey/prisma/accounts";

// export const accountInformation:Prisma.CustomerSelect = {
//     account: {
//         select: {
//             id: true,
//             status: true
//         }
//     },
// }

// export const validationsData: Prisma.CustomerSelect = {
//     account: {
//         select: {
//             //emailVerfication: true,
//             //phoneVerification: true,
//         }
//     },
//     verifications: true
// }

// export default (hash:string):Prisma.CustomerWhereInput => ({
//     AND: [
//         { account: { email: hash } },
//         { OR: [
//             { account: { status: 'ACTIVE' } },
//             { account: { status: 'BLOCKED' } },
//             { account: { status: 'IN_PROGRESS' } }
//         ] }
//     ]
// })
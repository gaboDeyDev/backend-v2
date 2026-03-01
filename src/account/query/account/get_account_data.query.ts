// import { Prisma } from "@dey/prisma/accounts";
// import { AccountQuery } from "../../types/account.type";
// import { AccessDataType } from "src/account/types/acccess_data.type";


// const minimalAccess: Prisma.AccountSelect = {
//     id: true,
//     email: true,
//     active: true,
//     customer: {
//         select: {
//             names: true,
//             familyName: true,
//             lastName: true,
//         }
//     }
// };

// const basicAccess: Prisma.AccountSelect = {
//     id: true,
//     email: true,
//     active: true,
//     customer: {
//         omit: {
//             id: true,
//             accountID: true
//         }
//     }
// }

// const fullAccess: Prisma.AccountInclude = {
//     onboarding: true,
//     sessions: true,
//     customer: {
//         include: {
//             verifications: true,
//             employment: {
//                 include: {
//                     company: true
//                 }
//             }
//         }
//     }
// }

// const sensitiveAccess: Prisma.AccountInclude = {
//     onboarding: true,
//     sessions: true,
//     customer: {
//         include: {
//             data: true,
//             verifications: true,
//             employment: {
//                 include: {
//                     company: true
//                 }
//             }
//         }
//     }
// }

// export default (id:string, criteria: AccessDataType):AccountQuery => {
//     return criteria === 'MINIMAL' || criteria === 'BASIC' ? {
//         where: { id },
//         select: criteria === 'MINIMAL' ? minimalAccess : basicAccess
//     } : {
//         where: { id },
//         include: criteria === 'SENSITIVE' ? sensitiveAccess : fullAccess
//     };
// }
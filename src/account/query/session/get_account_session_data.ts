
// import { AccessDataType } from "src/account/types/acccess_data.type";
// import { SessionQueryType } from "../../types/session_query.type";
// import { Prisma } from "@dey/prisma/accounts";


// const minimalInclude: Prisma.SessionInclude = {
//     account: {
//         select: {
//             id: true,
//             active: true,
//             status: true,
//             admin: {
//                 select: {
//                     id: true, 
//                     role: true
//                 }
//             },
//             customer: {
//                 select: {
//                     id: true
//                 }
//             }
//         }
//     }
// }

// const basicInclude: Prisma.SessionInclude = {
//     account: {
//         select: {
//             id: true,
//             active: true,
//             status: true,
//             email: true,
//             admin: {
//                 select: {
//                     id: true,
//                     role: true,
//                     charge: true,
//                 }
//             },
//             customer: {
//                 select: {
//                     id: true,
//                     birthDate: true,
//                     names: true,
//                     familyName: true,
//                 }
//             }
//         }
//     }
// }

// const fullInclude: Prisma.SessionInclude = {
//     account: {
//         select: {
//             id: true,
//             active: true,
//             status: true,
//             email: true,
//             admin: {
//                 omit: {
//                     createdAt: true,
//                     updatedAt: true,
//                 }
//             },
//             customer: {
//                 omit: {
//                     createdAt: true,
//                     updatedAt: true,
//                     accountID: true
//                 },
//                 include: {
//                     verifications: true,
//                     employment: {
//                         omit: {
//                             createdAt: true,
//                             updatedAt: true,
//                         },
//                         include: {
//                             company: {
//                                 omit: {
//                                     createdAt: true,
//                                     updatedAt: true,
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// const sensitiveInclude: Prisma.SessionInclude = {
//     account: {
//         select: {
//             id: true,
//             active: true,
//             status: true,
//             email: true,
//             admin: {
//                 omit: {
//                     createdAt: true,
//                     updatedAt: true,
//                 }
//             },
//             customer: {
//                 omit: {
//                     createdAt: true,
//                     updatedAt: true,
//                     accountID: true,
//                 },
//                 include: {
//                     data: {
//                         omit: {
//                             createdAt: true,
//                             updatedAt: true,
//                         }
//                     },
//                     verifications: true,
//                     employment: {
//                         omit: {
//                             createdAt: true,
//                             updatedAt: true,
//                         },
//                         include: {
//                             company: {
//                                 omit: {
//                                     createdAt: true,
//                                     updatedAt: true,
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// export default (id: string, type: AccessDataType = 'MINIMAL'): SessionQueryType => {

//     return {
//         where: { id },
//         include: (type === 'SENSITIVE') ? sensitiveInclude
//             : (type === 'BASIC') ? basicInclude 
//             : (type === 'FULL') ? fullInclude 
//             : minimalInclude
//     }
// }
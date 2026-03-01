// import { Prisma } from "@dey/prisma/accounts";
// import { AccountQuery } from "../../types/account.type";

// const selectForCustomer: Prisma.AccountSelect = {
//     id: true,
//     customer: {
//         select: {
//             id: true,
//             names: true,
//             familyName: true,
//             lastName: true,
//         }
//     }
// };

// const selectForAdmin: Prisma.AccountSelect = {
//     id: true,
//     admin: {
//         select: {
//             id: true,
//             name: true,
//             lastName: true,
//             role: true
//         }
//     }
// };

// const includeUserAdminData:Prisma.AccountInclude = {
//     admin: {
//         omit: {
//             createdAt: true,
//             updatedAt: true,
//         }
//     }
// }

// const includeUserCustomerData:Prisma.AccountInclude = {
//     customer: {
//         omit: {
//             createdAt: true,
//             updatedAt: true,
//         }
//     }
// }

// export default (accountID: string, type: 'customer' | 'admin', userData: boolean = false): AccountQuery => {
//     /*where: { id: accountID, active: true },
//     select: type === 'admin' 
//         ? selectForAdmin 
//         : selectForCustomer*/
    
//         return {
//             where: { id: accountID, active: true },
//             select: !userData? type === 'admin' ? selectForAdmin : selectForCustomer : undefined,
//             include: userData? type === 'admin' ? includeUserAdminData : includeUserCustomerData : undefined
//         }
// };
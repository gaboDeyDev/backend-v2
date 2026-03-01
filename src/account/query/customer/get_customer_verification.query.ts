// import { VerificationProviderType } from "@dey/prisma/accounts";
// import { CustomerQuery } from "../../types/customer_query";

// export default (id: string, type: VerificationProviderType): CustomerQuery => {

//     return {
//         where: { id: id },
//         select: {
//             names: true,
//             account: {
//                 select: {
//                     email: true
//                 }
//             },
//             verifications: {
//                 where: {
//                     provider: type
//                 }
//             }
//         }
//     }
// }
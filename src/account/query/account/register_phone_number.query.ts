// import { AccountQuery } from "../../types/account.type";
// import encrypt from "../../utils/encrypt/encrypt";
// import hash from "../../utils/encrypt/hash";

// export default async (id: string, phone: string, secret: CryptoKey, secretHash: string): Promise<AccountQuery> => {

//     return {
//         where: { id },
//         data: { 
//             customer: {
//                 update: {
//                     data: {
//                         data: {
//                             create: {
//                                 key: 'PHONE',
//                                 value: await encrypt(phone, secret),
//                                 hash: hash(phone, secretHash)
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }

// }
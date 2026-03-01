
// import { Prisma } from "@dey/prisma/accounts";
// import { CodeDto } from "../../dto/code.dto";

// export const selectQuery:Prisma.CodesSelect = {
//     account: {
//         select: {
//             id: true,
//             customer: {
//                 select: {
//                     names: true
//                 }
//             }
//         }
//     }
// }

// export default ({code, expiration, subject, value}: CodeDto): Prisma.CodesCreateInput => {

//     const codeInput: Omit<Prisma.CodesCreateInput, "account"> = {
//         expiresAt: expiration,
//         subject: subject!,
//         value: code!,
//     }

//     if(subject === 'EMAIL_VERIFICATION' || subject === 'RECOVERY_ACCOUNT'){
//         return {
//             ...codeInput,
//             account: {
//                 connect: {
//                     email: value!
//                 }
//             }
//         }
//     }else if(subject === 'PHONE_VERIFICATION'){
//         return {
//             ...codeInput,
//             account: {
//                 connect: {
//                     id: value!
//                 }
//             }
//         }
//     }

//     throw new Error('Invalid code subject');
// };
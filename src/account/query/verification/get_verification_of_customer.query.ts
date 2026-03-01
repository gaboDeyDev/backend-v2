
// import { VerificationProviderType } from "../../types/verification_provider.type";
// import { VerficationQueryType } from "../../types/verificartion_query.type";

// /*
// * id is the id of user
// */
// export default (id: string, verification: VerificationProviderType): VerficationQueryType => {

//     return {
//         where: {
//             customer: { id },
//             provider: verification
//         },
//         select: {
//             provider: true,
//             status: true,
//             result: true,
//             createdAt: true,
//         }
//     }
// }

// import { OnBoardingStep } from "../../types/onboarding.type";
// import { RegistrationProcedureQuery } from "../../types/registration_query.type";
// import { Prisma } from "@dey/prisma/accounts";

// export default (id: string, step: OnBoardingStep): RegistrationProcedureQuery => {

//     const data: Prisma.RegistrationProcedureUpdateInput = step === 'ACCEPT_TERMS_AND_CONDITIONS' ? 
//         { acceptTerms: true, acceptPrivacy: true } : step === 'EMAIL_VERIFICATION' ? 
//         { emailVerification: true } : step === 'PASSWORD_CREATION' ? 
//         { passwordChanged: true } : step === 'PHONE_VERIFICATION' ? 
//         { phoneVerification: true } : step === 'ACCEPT_PRODUCT' ? 
//         { acceptProduct: true } : step === 'IDENTITY_VERIFICATION' ?
//         { identityVerification: true } : {};

//     return {
//         where: { account: { id } },
//         data: data
//     }
// }
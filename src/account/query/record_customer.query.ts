// import { GenderType, Prisma } from "@dey/prisma/accounts";
// import encrypt from "../utils/encrypt/encrypt";
// import hash from "../utils/encrypt/hash";
// import { CustomerCreationDBDto } from "../dto/create_customer.dto";

// export default async (
//   {
//     user,
//     sensitive,
//     address,
//     kycVerification,
//     circleCreditValidation,
//     company,
//     employment,
//   }: CustomerCreationDBDto,
//   secret: CryptoKey,
//   secretHash: string
// ): Promise<Prisma.CustomerCreateInput> => {
//   /*const fields = {
//     CURP: sensitive.curp,
//     RFC: sensitive.rfc,
//     PHONE: sensitive.phoneNumber,
//     ADDRESS: JSON.stringify(address),
//     INE: sensitive.ine,
//     PASSPORT: sensitive.passport,
//   };

//   const create = await Promise.all(
//     Object.entries(fields)
//       .filter(([_, value]) => value !== undefined && value !== null) // solo los que existen
//       .map(async ([key, value]) => ({
//         key,
//         value: await encrypt(value!, secret),
//         hash: hash(value!, secretHash),
//       }))
//   );*/

//   return {
//     names: user.name,
//     familyName: user.familyName,
//     lastName: user.lastName,
//     birthDate: user.birthdate,
//     birthState: user.birthState,
//     gender: user.gender.toUpperCase() as GenderType,
//     nationality: user.nationality,
//     residenceCountry: user.residenceCountry,
//     residenceState: address.residenceState,
//     data: {
//       create: [
//         {
//           key: "CURP",
//           value: await encrypt(sensitive.curp, secret),
//           hash: hash(sensitive.curp, secretHash),
//         },
//         {
//           key: "RFC",
//           value: await encrypt(sensitive.rfc, secret),
//           hash: hash(sensitive.rfc, secretHash),
//         },
//         {
//           key: "PHONE",
//           value: await encrypt(sensitive.phoneNumber, secret),
//           hash: hash(sensitive.phoneNumber, secretHash),
//         },
//         {
//           key: "ADDRESS",
//           value: await encrypt(JSON.stringify(address), secret),
//           hash: hash(JSON.stringify(address), secretHash),
//         },
//         {
//           key: "INE",
//           value: await encrypt(sensitive.ine!, secret),
//           hash: hash(sensitive.ine!, secretHash),
//         },
//         {
//           key: "PASSPORT",
//           value: await encrypt(sensitive.passport!, secret),
//           hash: hash(sensitive.passport!, secretHash),
//         },
//       ],
//     },
//     account: {
//       create: {
//         email: user.email,
//         onboarding: {
//           create: {},
//         },
//       },
//     },
//     verifications: {
//       create: [
//         {
//           provider: "KYC",
//           result: kycVerification.result,
//           status: kycVerification.valid ? "APPROVED" : "FAILED",
//           verificationDate: new Date(),
//         },
//         {
//           provider: "CIRCLE_CREDIT",
//           result: circleCreditValidation.result,
//           status: circleCreditValidation.valid ? "APPROVED" : "FAILED",
//           verificationDate: new Date(),
//         },
//       ],
//     },
//     employment: {
//       create: {
//         phone: employment.phone,
//         extension: employment.extension,
//         fax: employment.fax,
//         position: employment.position,
//         department: employment.department,
//         hiringDay: employment.hiringDay,
//         currency: employment.currency,
//         monthlySalary: employment.mounthSalary,
//         lastDay: employment.lastDay,
//         verificationDay: employment.verificationDay,
//         originCompanyAddress: employment.originCompanyAddress,
//         salaryFrecuency: employment.salaryFrecuency as any,
//         insurance: employment.insurance as any,
//         company: {
//           create: {
//             name: company.name,
//             address: company.address,
//             colony: company.colony,
//             city: company.city,
//             state: company.state,
//             zipCode: company.zipCode,
//             phone: company.phone,
//           },
//         },
//       },
//     },
//   };
// };

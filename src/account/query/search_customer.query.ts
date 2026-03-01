// import { $Enums, Prisma } from "@dey/prisma/accounts";

// export default (data: any, specific: boolean = false): Prisma.CustomerWhereInput => {

//     const curp = data.curp?? undefined;
//     const rfc = data.rfc?? undefined;
//     const email = data.email?? undefined;
//     const phone = data.phone?? undefined;

//     const remove = ['curp', 'rfc', 'email', 'phone'];

//     const criteria: Prisma.CustomerWhereInput[] = Object.entries(data)
//     .filter(([key]) => !remove.includes(key))
//     .map(([key, value]) => ({ key: value } as Prisma.CustomerWhereInput));

//     if(curp) searchBySensitiveData('CURP' , curp, criteria);
//     if(rfc) searchBySensitiveData('RFC', rfc, criteria);
//     //if(email) searchBySensitiveData('EMAIL', email, criteria);
//     if(phone) searchBySensitiveData('PHONE', phone, criteria);

//     return specific ? {
//         account: { active: true},
//         AND: criteria
//     }: {
//         account: { active: true },
//         OR: criteria
//     }

// }

// const searchBySensitiveData = (
//     key: $Enums.SensitiveDataType, 
//     value: string, 
//     criteria: Prisma.CustomerWhereInput[] | undefined
// ) => {
//     criteria?.push({
//         data: {
//             some: {
//                 key,
//                 hash: value
//             }
//         }
//     });
// };


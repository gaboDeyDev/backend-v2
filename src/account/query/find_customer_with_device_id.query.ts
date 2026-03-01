// import { Prisma, SensitiveDataType } from "@dey/prisma/accounts";

// export default (id: string) => {

//     const where: Prisma.CustomerWhereUniqueInput = {
//         id,
//         data: {
//             some: {
//                 key: SensitiveDataType.DEVICE_ID
//             }
//         }
//     }

//     const select: Prisma.CustomerSelect = {
//         data: true
//     }

//     return {
//         where,
//         select
//     }

// }
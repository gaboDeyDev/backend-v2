// import { Prisma } from "@dey/prisma/accounts"
// import { SessionQueryType } from "../../types/session_query.type"

// const data: Prisma.SessionUpdateInput = {
//     active: false,
//     closed: true,
//     closedReason: 'MAX_ATTEMPTS',
//     account: {
//         update: {
//             active: false
//         }
//     }
// }

// export default (sessionID: string):SessionQueryType => ({
//     where: { id: sessionID, attempts: { lt: 3 }, active: true },
//     data
// })
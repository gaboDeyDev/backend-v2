// import { AccountQuery } from "../../types/account.type";
// import hashPassword from "../../utils/encrypt/hash_password";

// export default (id: string, password: string):AccountQuery => {

//     const encriptPassword = hashPassword(password, 10);

//     return {
//         where: { id: id },
//         data: {
//             password: encriptPassword
//         }
//     }
// }
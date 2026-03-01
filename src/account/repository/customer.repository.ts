
// import { Prisma, VerificationProviderType } from "@dey/prisma/accounts";
// =import findCustomerWithDeviceID from '../query/find_customer_with_device_id.query';
// import searchCustomerQuery from '../query/search_customer.query';
// import { accountInformation } from "../query/get_customer_by_sensitive_data.query";
// import recordCustomerQuery from '../query/record_customer.query';
// import getCustomerQuery from '../query/get_customer_by_sensitive_data.query';
// import updateCustomerQuery from '../query/update_customer.query';
// import { UpdateCustomerDataType } from "../types/customer.type";
// import { Inject, Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
// import getCryptoKey from '../utils/encrypt/get_crypto_key';
// import { catchError, firstValueFrom, from, map, mergeMap, of, throwError } from "rxjs";
// import getCustomerVerificationQuery from '../query/customer/get_customer_verification.query';
// import getSensitiveDataQuery from "../query/customer/get_sensitive_data.query";
// import decrypt from "../utils/encrypt/decrypt";
// import relatePomeloQuery from "../query/customer/relate_pomelo.query";
// import { AccountsPrismaService } from "src/prisma/accounts_prisma.service";
// import { RelationshipDto } from "../dto/relationship.dto";
// import { CustomerCreationDBDto } from "../dto/create_customer.dto";
import { ConfigService } from '@nestjs/config';


// @Injectable()
// export class CustomerRepository{

//     private repository: Prisma.CustomerDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
//     private logger: Logger;
//     private encryptKey: string;
//     private secretHash: string;

//     constructor(
//         private readonly prismaService:AccountsPrismaService
//     ){
//         this.repository = prismaService.customer;
//         this.logger = new Logger(CustomerRepository.name);
//         this.encryptKey = process.env.ENCRYPT_SECRET_KEY!;
//         this.secretHash = process.env.ENCRYPT_SECRET_HASH!;
//     }

//     async relateCustomerWithPomelo(keys: RelationshipDto) {
//         const query = relatePomeloQuery(keys);

//         return await this.repository.update(query as any);
//     }

//     async getSensitiveData(id: string) {
//         const query = getSensitiveDataQuery(id);
        
//         const encryptSecretKey: CryptoKey = await getCryptoKey(this.encryptKey);

//         return await firstValueFrom(from(this.repository.findFirst(query as any)).
//             pipe(
//                 mergeMap(async data => {

//                     if(!data) return [];

//                     return await Promise.all(data['data'].map(async item => {
//                         return {
//                             key: item.key,
//                             value: await decrypt(item.value, encryptSecretKey)
//                         }
//                     }));
//                 })
//             ));
//     }

//     async getVerificationCustomer(id: string, type: string) {

//         const { where, select } = getCustomerVerificationQuery(id, type as VerificationProviderType);

//         return await this.repository.findFirst({ where, select });
//     }

//     async getDeviceIDByCustomer(id: string) {
//         const { where, select } = findCustomerWithDeviceID(id);

//         const data = await this.repository.findFirst({ where, select }) as any;

//         if(!data) return undefined;

//         return data.data.value;
//     }

//     get(data: any) {
//         const query = searchCustomerQuery(data);

//         return this.repository.findFirst({ where: query, select: accountInformation });
//     }
    
//     async save(userData: CustomerCreationDBDto) {

//         const encryptSecretKey: CryptoKey = await getCryptoKey(this.encryptKey);
        
//         const data = await recordCustomerQuery(userData, encryptSecretKey, this.secretHash);

//         this.logger.debug(JSON.stringify(data));

//         const { id } = await firstValueFrom(from(this.repository.create({ data })).pipe(
//             catchError(error => {
//                 console.log('here');
                
//                 console.error(`Error creating customer: ${error}`);
//                 throw throwError(() => new ServiceUnavailableException());
//             })
//         ));

//         return id;
//     }

//     async getByEmail(email: string) {
        
//         const where = getCustomerQuery(email);

//         return await this.repository.findFirst({ where, select: accountInformation });
//     }


//     async getByRFC(rfc: string) {

//         const where = getCustomerQuery(rfc);

//         return await this.repository.findFirst({ where, select: accountInformation });

//     }

//     async getByCurp(curp: string) {

//         const where = getCustomerQuery(curp);

//         return await this.repository.findFirst({ where, select: accountInformation });
//     }

//     async getByPhoneNumber(phone: string) {
//         const where = getCustomerQuery(phone);

//         return await this.repository.findFirst({ where, select: accountInformation });
//     }

//     async getById(id: string) {
        
//         return await this.repository.findFirst({ where: { id }, select: accountInformation });

//     }
    
//     /*async searchByCriteria({ data, limit, page }: SearchDto<any>) {
        
//         //return await this.repository.search({ where: data, limit, page });

//     }*/
    
//     async update(id: string, data: UpdateCustomerDataType) {
        
//         const update = updateCustomerQuery(data);

//         return await this.repository.update({ data: update, where: { id } });
//     }
    
//     async delete(id: string) {
//         await this.repository.delete({ where: { id } });
//     }

// }
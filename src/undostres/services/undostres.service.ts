import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UNDOSTRES_CLIENT_FACTURABLE, UNDOSTRES_CLIENT_NO_FACTURABLE } from '../symbols/symbols';
import { CategoryArray, CategoryType } from '../types/categories.type';
import { catchError, firstValueFrom, map, mergeMap, throwError } from 'rxjs';
import { AccountInfoDto } from '../data/dto/account_info.dto';
import dayjs from 'dayjs';
import { UndostresModel } from '../data/model/undostres.model';
import chunkArray from '../functions/chunkArray';
import { UndostresCuotasService } from './undostres_cuotas.service';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { UserPomeloService } from './user_pomelo.service';
import { CreateTransactionDto } from 'src/pomelo/dto/create-transaction';

@Injectable()
export class UndostresService {
  private logger: Logger;
  constructor(
    @Inject(UNDOSTRES_CLIENT_FACTURABLE) private httpService: HttpService,
    @Inject(UNDOSTRES_CLIENT_NO_FACTURABLE) private httpServiceNoFacturable: HttpService,
    private readonly cuotasService: UndostresCuotasService,
    private readonly pomeloService: PomeloService,
    private readonly userPomeloService: UserPomeloService
  ) {
    this.logger = new Logger(UndostresService.name);
  }

  getCategories(): CategoryType[] {
    return CategoryArray;
  }

  async availableServices(type: CategoryType) {
    
    return await firstValueFrom(
      (type === 'Giftcards' ? this.httpService.get(`sku-list?row_limit=1000&category=${type}`) : this.httpServiceNoFacturable.get(`sku-list?row_limit=1000&category=${type}`)
    ).pipe(
      catchError((error) => {
        return throwError(
          () => {
            console.log(type);

              console.log(error);
              
              new ServiceUnavailableException(
                'Undostres service is unavailable',
              );
            }
          );
        }),
        mergeMap(async (response: any) => {
          const services = response.data.skus.filter(item => item.active === 'encendido');

          const groups: Record<string, any[]> = {};

          for (const obj of services) {
            if (!groups[obj.operator]) {
              groups[obj.operator] = [];
            }
            const serviceData = await this.cuotasService.getServiceFromSkuId(obj.id);
            if(serviceData)
              groups[obj.operator].push(serviceData);
          }

          Object.entries(groups).forEach(([key, value]) => {
            if(value.length === 0) delete groups[key];
          });

          return groups;
        }),
      ),
    );
  }

  async getInformationFromChain(): Promise<AccountInfoDto>{
    return firstValueFrom(
      this.httpService.get('').pipe(
        catchError((error) => {
          return throwError(
            () =>
              new ServiceUnavailableException(
                'Undostres service is unavailable',
              ),
          );
        }),
        map((response: any) => response.data as AccountInfoDto),
      ),
    );
  }

  async getConciliation(){
    return firstValueFrom(this.httpService.get(`conciliation?date=${dayjs().format('YYYY-MM-DD')}`).pipe(
        catchError((error) => {
          return throwError(
            () =>
              new ServiceUnavailableException(
                'Undostres service is unavailable',
              ),
          );
        }),
        map((response: any) => response.data.transactions),
    ));
  }

  async makePayment(id: number, ref:string, userID?: number, amount?: number): Promise<any> {
    console.log(ref);

    console.log('here');
    console.log(id);
    const service = await this.cuotasService.getServiceFromSkuId(id);

    console.log(service);
    

    if (!service) {
      return { message: 'Service not found' };
    }

    console.log(service);
    

    const reference = service.paymentReferenceType !== 'NUMERO_TELEFONO' ? ref : '2314587596';
    
    //const { account_email } = await this.getInformationFromChain();

    const payload = {
        reference: reference,
        skuId: id,
        //transactionId: '',
        //'account-email': account_email,

    };

    console.log(payload);
    

    const credit_line = await this.userPomeloService.getCreditLineUserFromId(userID!);

    console.log(credit_line);

    console.log('is facturable?: ' + service.facturable);
    

    return firstValueFrom((service.facturable ? this.httpService.post('pay', payload) : this.httpServiceNoFacturable.post('pay', payload)).pipe(
        catchError((error) => {

          console.log(error);
          

          return throwError(
            
            () =>{
              return new ServiceUnavailableException(
                'Undostres service is unavailable',
              );}
          );
        }),
        mergeMap(async (response: any) => {

          const json = JSON.parse(response.data.api_response)

          const transactionInitial: CreateTransactionDto = {
                    account_id: credit_line?.sod_id || '',
                    type: "CASHOUT",
                    process_type: "ORIGINAL",
                    data: {
                      tx_properties: {
                        network_name: "Dey",
                      },
                      description: {
                        "en-US": "Pado de Servicios Undostres"
                      },
                      details: [
                        {
                          amount: (json.SALDO).toFixed(2).toString(),
                          entry_type: "DEBIT",
                          type: "BASE",
                          subtype: "TRANSFER",
                          description: {
                            "en-US": "transfer to client"
                          },
                        }
                      ],
                    },
                    entry_type: "DEBIT",
                    total_amount: (json.SALDO).toFixed(2).toString(),
                  };

                  await this.pomeloService.createPomeloTransaction(transactionInitial);

          console.log(response.data);

          const pomeloResponse = await this.pomeloService.informarOperacionPomelo({
            credit_line_id: credit_line!.sod_id!,
            amount: `${amount}`,
            type: 'CHARGE',
            operation_date: new Date().toISOString(),
            description: `Pago de servicio con referencia ${ref}`,
            currency: 'MXN'
          });

          console.log(pomeloResponse);

          console.log(response.data);
          
          

          return {
            success: true,
            message: response.data.purchase_vouchers ?? 'Pago exitoso',
          };
        }),
    ));
  }

  async getAmountToPay(skuid: number, ref:string){

    const { account_email } = await this.getInformationFromChain();

    const payload = {
        reference: ref,
        skuId: skuid,
        'account-email': account_email,  
    };

    return firstValueFrom(this.httpService.post(`fetch-balance`, payload).pipe(
        catchError((error) => {
          return throwError(
            () =>
              new ServiceUnavailableException(
                'Undostres service is unavailable',
              ),
          );
        }),
        map((response: any) => {
          console.log(response.data);
          
          return response.data.balance_amount
        }),
    ));
  }

  async addServices(services: UndostresModel[]){
    const groups = chunkArray(services, 50);

    for (const group of groups) {
      const stack = [...group];
      this.logger.log(`Processing group of ${stack.length} items`);
      while (stack.length > 0) {
        this.logger.log(`Items left in stack: ${stack.length}`);
        const results = await this.cuotasService.saveCuotas(stack);
        const indexes = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value as number);
        this.logger.log(`Successfully processed ${indexes.length} items`);
        this.logger.log(`Failed to process ${results.length - indexes.length} items`);
        if (indexes.length === 0) {
          this.logger.error('No items were processed successfully, stopping to avoid infinite loop');
          break;
        }
        for (let i = indexes.length - 1; i >= 0; i--) {
          stack.splice(indexes[i], 1);
        }
      }
    }

    return { message: 'Services added successfully' };
  }

  async fetchServiceBySkuId(skuId: number, ref:string): Promise<any> {
    const service = await this.cuotasService.getServiceFromSkuId(skuId);
    if (!service) {
      return { message: 'Service not found' };
    }

    const payload = {
        reference: ref,
        skuId: skuId,
    };

    console.log(service);
    
    return await firstValueFrom(
      ( service.facturable ? this.httpService.post(`fetch-balance`,payload) : this.httpServiceNoFacturable.post(`fetch-balance`,payload)).pipe(
        catchError((error) => {
          console.log(error.response.data);
          
          return throwError(
            () =>
              new ServiceUnavailableException(
                'Undostres service is unavailable',
              ),
          );
        }),
        map((response: any) => {
          console.log(response.data);
          return response.data.balance_amount;
        }),
      )
    );
  }
}

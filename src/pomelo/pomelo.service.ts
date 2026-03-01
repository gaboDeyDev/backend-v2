import { Injectable } from '@nestjs/common';
import { CreatePomeloDto } from './dto/create-pomelo.dto';
//import { UpdatePomeloDto } from './dto/update-pomelo.dto';
import { CreatePomeloUserDto } from './dto/create-pomelo-user.dto';
import { CreatePomeloAccountDto } from './dto/create-pomelo-account.dto';
import { CreatePomeloAssociationDto } from './dto/create-pomelo-association.dt';
import { CreatePomeUserCreditDto } from './dto/create-pomelo-user-credit.dt';
import { CreatePomeloCardDto, UpdatePomeloCardDto } from './dto/create-pomelo-card.dto';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { UserVerifiedService } from 'src/customer/services/user-verified.service';
import axios from 'axios';
import { StpService } from 'src/stp/stp.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { referDto } from './dto/refer.dto';
import { DateUtils } from 'src/utils/dateFormater/date';
import { fillWithZeros } from 'src/utils/dateFormater/common';
import { CreateTransactionDto } from './dto/create-transaction';
import { v4 as uuidv4 } from 'uuid';
const config = require('@nestjs/config');

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class PomeloService {
  private pomeloUrl: string;
  private clientId: string;
  private clientSecret: string;
  private audience: string;

  constructor(
    private readonly userVerifiedServices: UserVerifiedService,
    private readonly stpService: StpService,
    private readonly prisma: PrismaService,

  ) {

    // Use ConfigService for environment variables instead of process.env
    const configService = new config.ConfigService();
    this.pomeloUrl = configService.get('POMELO_URL', '');
    this.clientId = configService.get('POMELO_CLIENT_ID', '');
    this.clientSecret = configService.get('POMELO_CLIENT_SECRET', '');
    this.audience = configService.get('POMELO_AUDIENCE', '');
  }

  create(createPomeloDto: CreatePomeloDto) {
    return 'This action adds a new pomelo';
  }
  findAll() {
    return `This action returns all pomelo`;
  }


  async getPomeloToken() {
    console.log('Fetching Pomelo token...');
    console.log('Pomelo URL:', this.pomeloUrl);
    console.log('Client ID:', this.clientId);
    console.log('Client Secret:', this.clientSecret);
    console.log('Audience:', this.audience);
    console.log('Grant Type: client_credentials');
    console.log('Url:', `${this.pomeloUrl}/oauth/token`);
    try {
      const url = `${this.pomeloUrl}/oauth/token`;
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: this.audience
        }),
      })
        .then(response => response.json());
    } catch (error) {
      return `Error fetching Pomelo token: ${error.message}`;
    }
  }
  async createUserPomelo(createPomeloDto: CreatePomeloUserDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/users/v1/`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify(createPomeloDto),
      })
        .then(response => response.json());
    } catch (error) {
      return `Error creating Pomelo user: ${error.message}`;
    }
  }
  async createPomeloAccount(createPomeloDto: CreatePomeloAccountDto, impotemcyKey: string) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/core/accounts/v1`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
          'X-Idempotency-Key': impotemcyKey
        },
        body: JSON.stringify(createPomeloDto),
      })
        .then(response => response.json());
    } catch (error) {
      return `Error creating Pomelo account: ${error.message}`;
    }
  }
  async createPomeloCard(createPomeloDto: CreatePomeloCardDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/v1/`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify(createPomeloDto),
      })
        .then(response => response.json());
    } catch (error) {
      return `Error creating Pomelo card: ${error.message}`;
    }
  }


  async updatePomeloCard(createPomeloDto: UpdatePomeloCardDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/v1/${createPomeloDto.card_id}`;

      const response = await axios.patch(
        url,
        {
          status: createPomeloDto.status,
          status_reason: createPomeloDto.status_reason,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log(JSON.stringify(error))
      console.error('Error updating Pomelo card:', error.response?.data?.error?.details || error.message?.error?.details);
      throw new Error(`Error updating Pomelo card: ${error.response?.data?.message || error.message}`);
    }
  }

  async updatePomeloCardPin(createPomeloDto: UpdatePomeloCardDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/v1/${createPomeloDto.card_id}`;

      const response = await axios.patch(
        url,
        {
          pin: createPomeloDto.pin
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log(JSON.stringify(error))
      console.error('Error updating Pomelo card:', error.response?.data?.error?.details || error.message?.error?.details);
      throw new Error(`Error updating Pomelo card: ${error.response?.data?.message || error.message}`);
    }
  }

  async createPhysicalCard(email: string) {
    try {
      const user =
        await this.userVerifiedServices.findUserByEmail(email);
      console.log('User found for creating physical card:', user);
      if (!user) {
        throw new Error('User not found');
      }
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      console.log('Pomelo info found for user:', getPomeloInfo);
      const pomeloAccountId = getPomeloInfo?.pomelo_user_id;
      const createPomeloCardDto: CreatePomeloCardDto = {
        user_id: pomeloAccountId,
        affinity_group_id: "afg-30CVMJfeBfA21cAOKRTZZFc8Dxp",
        card_type: 'PHYSICAL',
        address: {
          street_name: user.legal_street_name ?? '',
          street_number: String(user.legal_street_number),
          floor: String(user.legal_floor),
          apartment: user.legal_apartment ?? '',
          city: user.legal_city ?? '',
          region: user.legal_region ?? '',
          country: 'MEX',
          zip_code: String(user.legal_zip_code),
          neighborhood: user.legal_neighborhood ?? '',
          additional_info: user.legal_additional_info ?? '',
        },
        pin: '4739'
      };
      const createPomeloCardResponse = await this.createPomeloCard(createPomeloCardDto);
      // Obtener el último id de requests_physic_card
      const lastEntry = await this.prisma.requests_physic_card.findFirst({
        orderBy: { id: 'desc' },
      });
      const nextId = lastEntry ? lastEntry.id + 1 : 1;
      await this.prisma.requests_physic_card.create({
        data: {
          id: nextId,
          user_id: getPomeloInfo.id,
          status: 'requested',
        }
      });
      await this.prisma.user.update({
        where: { id: getPomeloInfo.id },
        data: { physical_card_id: createPomeloCardResponse?.data?.id },
      });

      console.log('Physical card creation process completed successfully.');
      console.log('createPomeloCardResponse', {
        user_id: getPomeloInfo.id,
        card_external_id: createPomeloCardResponse?.data?.id,
        type: 'physical_requested'
      });

      // Obtener el último id de user_cards
      const lastUserCard = await this.prisma.user_cards.findFirst({
        orderBy: { id: 'desc' },
      });
      const nextUserCardId = lastUserCard ? lastUserCard.id + 1 : 1;

      await this.prisma.user_cards.create({
        data: {
          id: nextUserCardId,
          user_id: getPomeloInfo.id,
          card_external_id: createPomeloCardResponse?.data?.id,
          type: 'physical_requested'
        }
      });
    } catch (error) {
      console.error('Error creating Pomelo physical card:', error);
      return `Error creating Pomelo physical card: ${error.message}`;
    }
  }

  async activePhisicalCard(email: string) {
    const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
    try {

      const lastEntry = await this.prisma.requests_physic_card.findFirst({
        orderBy: { id: 'desc' },
      });

      const nextId = lastEntry ? lastEntry.id + 1 : 1;
      await this.prisma.requests_physic_card.create({
        data: {
          id: nextId,
          user_id: getPomeloInfo.id,
          status: 'active',
        }
      });
    } catch (error) {
      console.error('Error creating Pomelo physical card:', error);
      return `Error creating Pomelo physical card: ${error.message}`;
    }
  }

  async createPomeloAssociation(createPomeloDto: CreatePomeloAssociationDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/associations/v1/`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify(createPomeloDto),
      })
        .then(response => response.json());
    } catch (error) {
      return `Error creating Pomelo association: ${error.message}`;
    }
  }
  async createPomeloUserCredit(createPomeloDto: CreatePomeUserCreditDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/lending/v1/credit-lines`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify(createPomeloDto),
      })
        .then(response => response.json());
    } catch (error) {
      return `Error creating Pomelo user credit: ${error.message}`;
    }
  }

  async createPomeloTransaction(transactionDto: CreateTransactionDto) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/core/transactions/v1`;
      const response = await axios.post(url, transactionDto, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating Pomelo transaction:', error.response?.data || error.message);
      throw new Error(`Error creating Pomelo transaction: ${error.response?.data?.message || error.message}`);
    }
  }

  async getPomeloUsers() {
    // /users/v1/
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/users/v1/`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
        .then(response => response.json());
    } catch (error) {
      return `Error fetching Pomelo users: ${error.message}`;
    }
  }

  // /lending/v1/credit-lines/{credit_line_id}
  async getPomeloUserCredit(creditLineId: string) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/lending/v1/credit-lines/${creditLineId}`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
        .then(response => {

          console.log('Pomelo user credit response:', response);
          return response.json()
        });
    } catch (error) {
      return `Error fetching Pomelo user credit: ${error.message}`;
    }
  }

  ///core/accounts/v1/{id}
  async getPomeloAccountById(accountId: string) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/core/accounts/v1/${accountId}`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
        .then(response => {
          console.log('response', response)
          return response.json()
        });
    } catch (error) {
      return `Error fetching Pomelo account by ID: ${error.message}`;
    }
  }

  // /lending/v1/collections?filter[credit_line_id]={credit_line_id}


  async getInputaciones(creditLineId: string) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/lending/v1/collections?filter[credit_line_id]=${creditLineId}`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
        .then(response => response.json());
    } catch (error) {
      return `Error fetching Pomelo inputaciones: ${error.message}`;
    }
  }

  async getActivities(creditLineId: string) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/core/activities/v1?filter[account_id]=${creditLineId}`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
        .then(response => response.json());
    } catch (error) {
      return `Error fetching Pomelo inputaciones: ${error.message}`;
    }
  }

  // /cards/v1/
  async getPomeloCardsByUser(user_id: string) {
    try {
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/v1/?filter[user_id]=${user_id}`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
        .then(response => {
          if (response.status !== 200) {
            return { error: `Error fetching Pomelo cards: ${response.statusText}` }
          }
          console.log('response', response)
          return response.json()

        });
    } catch (error) {
      return `Error fetching Pomelo cards: ${error.message}`;
    }
  }

  public async getCustomerInformation(
    email: string,
  ): Promise<any> {
    let userInfo
    let getPomeloInfo
    let cards
    let pomeloBalance
    try {
      userInfo = await this.userVerifiedServices.findUserByEmail(email);
      getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      console.log('userInfo', userInfo);
      cards = await this.getPomeloCardsByUser(getPomeloInfo.pomelo_user_id);
      console.log('cards', cards);
      // const pomeloBalance = await this.getPomeloUserCredit(getPomeloInfo.sod_id);
      pomeloBalance = await this.getPomeloAccountById(getPomeloInfo.sod_id);
      // console.log('pomeloBalance', JSON.stringify(pomeloBalance));

      const startDate = new Date('2025-10-06'); // Fecha de inicio
      const { paymentDate, cutoffDate, startCurrentCutDate } = this.getNextDates(startDate);

      console.log('Fecha de pago próxima:', paymentDate.toLocaleDateString());
      console.log('Fecha de corte próxima:', cutoffDate.toLocaleDateString());

      // Calcular el pago mínimo según las reglas:
      console.log('userInfo', userInfo);
      let isPayment = false;
      const imputaciones = await this.getActivities(getPomeloInfo.sod_id);
      let amountDebt = 0;
      let totalAbonos = 0;
      let comissionPaymentDate = new Date();
      imputaciones?.data?.forEach((element) => {
        console.log('element', element);
        if (element.type === 'CASHOUT') {
          amountDebt += Number(element.total_amount) || 0;
          if (element.data.description?.toUpperCase().includes('COMISION POR PAGO TARDIO')) {
            comissionPaymentDate = new Date(element.created_at)
          }
        }
        if (
          element.type === 'CASHIN' &&
          new Date(element.created_at) >= startCurrentCutDate
        ) {
          isPayment = true;
          const abono = Number(element.total_amount) || 0;
          totalAbonos += abono;
        }
      });

      amountDebt = amountDebt.toFixed(2) as unknown as number;

      let remainingDebt = Number(amountDebt) - Number(totalAbonos);
      if (isNaN(remainingDebt) || remainingDebt < 0) {
        remainingDebt = 0;
      } else {
        remainingDebt = Number(remainingDebt.toFixed(2));
      }

      const tasaOrdinadiaAnual = 95;
      const tasaOrdinariaDiaria = (tasaOrdinadiaAnual / 365) * 7;

      const daysRemaining = (new Date()).getDate() - new Date(comissionPaymentDate).getDate();
      console.log('daysRemaining', daysRemaining);
      console.log('remainingDebt', remainingDebt);
      console.log('tasaOrdinariaDiaria', tasaOrdinariaDiaria);

      remainingDebt = (remainingDebt * (tasaOrdinariaDiaria / 100) * daysRemaining) + remainingDebt;

      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });
      // Ensure salary is a finite number before doing arithmetic
      const salary = Number(user?.salary ?? 0);
      const creditLine = Number.isFinite(salary) ? salary * 0.3 : 0;
      console.log('creditLine', creditLine);
      const revolvingBalance = amountDebt || 0;
      console.log('revolvingBalance', revolvingBalance);
      const pendingBalance = amountDebt || 0;
      console.log('pendingBalance', pendingBalance);
      const monthlyInterest = 0; // Si tienes el dato de intereses mensuales, reemplaza aquí

      const min1 = creditLine * 0.0125;
      console.log('min1', min1);
      const dailyInterest = (revolvingBalance * (tasaOrdinariaDiaria / 100)) * 1.16; // incluye IVA 16%
      const min2 = (revolvingBalance * 0.015) + dailyInterest;
      console.log('min2', min2);
      const min3 = pendingBalance * 0.08 + monthlyInterest;
      console.log('min3', min3);
      // deberia ser 37.5

      const minimumPayment = (Math.max(min1, min2, min3)).toFixed(2);

      let userImg: string | null = null;
      if (getPomeloInfo && getPomeloInfo.profile_image) {
        const imageBuffer = Buffer.from(getPomeloInfo.profile_image); // 🔸 asegura conversión real
        const base64 = imageBuffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;
        userImg = dataUri;
      } else {
        userImg = null;
      }


      const accountStates = await this.prisma.account_states.findMany({
        where: {
          email: email
        },
      });

      return {
        cardData: cards.data || [],
        pomeloBalance,
        userInfo: {
          name: userInfo?.names || '',
          gender: userInfo?.gender || '',
          email: userInfo?.email || '',
          curp: userInfo?.curp || '',
          rfc: userInfo?.rfc || '',
          fathersLastName: userInfo?.fathers_lastname || '',
          mothersLastName: userInfo?.mothers_lastname || '',
          phone: userInfo?.phone || '',
          totalDebt: amountDebt || 0,
          minimumPayment: minimumPayment || 0,
          normalPayment: amountDebt || 0,
          paymentToSettle: amountDebt || 0,
          creditLimit: pomeloBalance?.data?.balance || 0,
          available: pomeloBalance?.data?.balance || 0,
          paymentDate: paymentDate ? dayjs(paymentDate).format('DD/MM/YYYY') : undefined,
          coutDate: cutoffDate ? dayjs(cutoffDate).format('DD/MM/YYYY') : undefined,
          img: userImg,
          accountStates: [...accountStates],
              }
            };
    } catch (error) {
      console.error('Error in getCustomerInformation[1]:', error);
      return {
        message: `Error fetching customer information: ${error.message}`,
        userInfo,
        getPomeloInfo,
        pomeloBalance,
        cards
      }
    }
  }

  public async getCustomerInputaciones(
    email: string,
  ): Promise<any> {
    try {
      const userInfo = await this.userVerifiedServices.findUserByEmail(email);
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      console.log('userInfo', userInfo);
      const imputaciones = await this.getActivities(getPomeloInfo.sod_id);
      console.log('imputaciones', imputaciones);
      imputaciones?.data?.forEach((element) => {
        console.log('element', element);
      });


      return imputaciones?.data || [];
    } catch (error) {
      console.error('Error in getCustomerInformation[2]:', error);
      throw new Error(`Error fetching customer information: ${error.message}`);
    }
  }

  public async getUserData(CURP: string, id: number): Promise<any> {
    try {
      console.log('Fetching user data for CURP:', CURP, 'and ID:', id);
      const currentDay = dayjs().tz("America/Mexico_City").date();
      // const userId = String(id);
      // const pomeloBalance = await this.getCustomerInformationService.getPomeloUserCredit('lcr-31R25xb7APQHzbGtaQbFbCAJj64');
      const pomeloBalance = await this.getPomeloUserCredit('lcr-31R25xb7APQHzbGtaQbFbCAJj64');
      console.log('pomeloBalance', JSON.stringify(pomeloBalance));

      enum CARD_STATUS {
        REQUESTED = 'solicitada',
        ACTIVE = 'activa',
        REJECTED = 'cancelada',
      }

      const physicalCardIsRequested: CARD_STATUS = CARD_STATUS.REQUESTED
      const daily_amount = 100; // cambiar a dinamico

      const response = {
        type: 'Microcrédito', // cambiar a dinamico
        balance: pomeloBalance?.data?.balances?.single_payment?.available || 0,
        debt: pomeloBalance?.data?.balances?.single_payment?.utilization || 0,
        daily_accumulated: currentDay * daily_amount,
        cycle_day: currentDay,
        end_date: dayjs().tz("America/Mexico_City").endOf('month').format('YYYY-MM-DD'),
        daily_amount: daily_amount,
        amount_approved: 7000, // cambiar a dinamico
        credit_id: pomeloBalance?.data?.id || '',
        physicalCardStatus: physicalCardIsRequested,
        cutDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        paymentDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          15
        ) < new Date()
          ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)
          : new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      };

      return response;
    } catch (error) {
      console.error('Error in getUserData:', error);
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }

  /**
 * Informa un cargo o abono a Pomelo (endpoint /lending/v1/collections)
 * @param params - parámetros requeridos por Pomelo
 * @param idempotencyKey - opcional, si no se pasa se genera uno
 */
  async informarOperacionPomelo(params: {
    credit_line_id: string;
    external_id?: string;
    type: 'PAYMENT' | 'CHARGE' | 'DISCOUNT';
    amount: string;
    currency: 'MXN';
    operation_date: string;
    description: string;
  }) {
    try {
      console.log('Informing operation to Pomelo with params:', params);
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/lending/v1/collections`;
      // Generar idempotency key si no se pasa
      const key = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
          'x-idempotency-key': key,
        },
      });
      console.log('Pomelo operation response status:', response);
      return await response.data
    } catch (error) {
      console.log('Error informing operation to Pomelo:', error.response?.data || error.message);
      console.log('Error informing operation to Pomelo:', error.response?.data?.error?.details || error.message);
      throw new Error('Error informando operación a Pomelo: ' + error.message);
    }
  }

  async getPomeloSecureData(email: string) {
    try {
      console.log('Getting Pomelo secure data for email:', email);
      // const tokenData = await this.getPomeloToken();
      // Step 2: Get secure data token from Pomelo
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const tokenDataSecurity = await this.getPomeloToken();


      const secureTokenUrl = 'https://api-sandbox.pomelo.la/secure-data/v1/token';
      console.log('Secure Token URL:', secureTokenUrl);
      const secureTokenResponse = await axios.post(
        secureTokenUrl,
        { user_id: getPomeloInfo.pomelo_user_id },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${tokenDataSecurity.access_token}`,
          },
        }
      );
      console.log('Secure token response:', secureTokenResponse.data);
      const secureDataToken = secureTokenResponse.data?.access_token;

      console.log('Fetching Pomelo secure data for email:', email);

      const cardId = getPomeloInfo.virtual_card_id;

      console.log('Card ID:', cardId);
      console.log('getPomeloInfo', getPomeloInfo);
      // const tokenData = await this.getPomeloToken();
      const url = `https://secure-data-web-sandbox.pomelo.la/v1/${cardId}?auth=${secureDataToken}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'Content-type: application/json; charset=UTF-8',
          'Authorization': `Bearer ${secureDataToken}`,
        },
      });
      // console.log('Pomelo secure data response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getPomeloSecureData:', error);
      return `Error fetching Pomelo secure data: ${error.message}`;
    }
  }

  async getPomeloPhisycalSecureData(email: string) {
    try {
      console.log('Getting Pomelo secure data for email:', email);
      // const tokenData = await this.getPomeloToken();
      // Step 2: Get secure data token from Pomelo
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const tokenDataSecurity = await this.getPomeloToken();


      const secureTokenUrl = 'https://api-sandbox.pomelo.la/secure-data/v1/token';
      console.log('Secure Token URL:', secureTokenUrl);
      const secureTokenResponse = await axios.post(
        secureTokenUrl,
        { user_id: getPomeloInfo.pomelo_user_id },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${tokenDataSecurity.access_token}`,
          },
        }
      );
      console.log('Secure token response:', secureTokenResponse.data);
      const secureDataToken = secureTokenResponse.data?.access_token;

      console.log('Fetching Pomelo secure data for email:', email);

      const cardId = getPomeloInfo.physical_card_id;

      console.log('Card ID:', cardId);
      console.log('getPomeloInfo', getPomeloInfo);
      // const tokenData = await this.getPomeloToken();
      const url = `https://secure-data-web-sandbox.pomelo.la/v1/${cardId}?auth=${secureDataToken}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'Content-type: application/json; charset=UTF-8',
          'Authorization': `Bearer ${secureDataToken}`,
        },
      });
      // console.log('Pomelo secure data response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getPomeloSecureData:', error);
      return `Error fetching Pomelo secure data: ${error.message}`;
    }
  }

  async getPomeloChangePinCard(email: string) {
    try {
      console.log('Getting Pomelo secure data for email:', email);
      // const tokenData = await this.getPomeloToken();
      // Step 2: Get secure data token from Pomelo
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const tokenDataSecurity = await this.getPomeloToken();


      const secureTokenUrl = 'https://api-sandbox.pomelo.la/secure-data/v1/token';
      console.log('Secure Token URL:', secureTokenUrl);
      const secureTokenResponse = await axios.post(
        secureTokenUrl,
        { user_id: getPomeloInfo.pomelo_user_id },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${tokenDataSecurity.access_token}`,
          },
        }
      );
      console.log('Secure token response:', secureTokenResponse.data);
      const secureDataToken = secureTokenResponse.data?.access_token;

      console.log('Fetching Pomelo secure data for email:', email);

      const cardId = getPomeloInfo.virtual_card_id;

      console.log('Card ID:', cardId);
      console.log('getPomeloInfo', getPomeloInfo);
      // const tokenData = await this.getPomeloToken();
      const url = `https://secure-data-web-sandbox.pomelo.la/v1/change-pin/${cardId}?auth=${secureDataToken}success_link=https://mail.dey.mx/`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'Content-type: application/json; charset=UTF-8',
          'Authorization': `Bearer ${secureDataToken}`,
        },
      });
      // console.log('Pomelo secure data response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getPomeloSecureData:', error);
      return `Error fetching Pomelo secure data: ${error.message}`;
    }
  }

  async getPomeloActivateCard(email: string) {
    try {
      console.log('Getting Pomelo secure data for email:', email);
      // const tokenData = await this.getPomeloToken();
      // Step 2: Get secure data token from Pomelo
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const tokenDataSecurity = await this.getPomeloToken();


      const secureTokenUrl = 'https://api-sandbox.pomelo.la/secure-data/v1/token';
      console.log('Secure Token URL:', secureTokenUrl);
      const secureTokenResponse = await axios.post(
        secureTokenUrl,
        { user_id: getPomeloInfo.pomelo_user_id },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${tokenDataSecurity.access_token}`,
          },
        }
      );
      console.log('Secure token response:', secureTokenResponse.data);
      const secureDataToken = secureTokenResponse.data?.access_token;

      console.log('Fetching Pomelo secure data for email:', email);

      const cardId = getPomeloInfo.virtual_card_id;

      console.log('Card ID:', cardId);
      console.log('getPomeloInfo', getPomeloInfo);
      // const tokenData = await this.getPomeloToken();
      const url = `https://secure-data-web-sandbox.pomelo.la/v1/activate-card?locale=es&country=MEX`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'Content-type: application/json; charset=UTF-8',
          'Authorization': `Bearer ${secureDataToken}`,
        },
      });
      // console.log('Pomelo secure data response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getPomeloSecureData:', error);
      return `Error fetching Pomelo secure data: ${error.message}`;
    }
  }


  async generateReference(cognitoUserId: string, body: any) {

    let finalCode: string;
    const textToDate = DateUtils.addDaysToDate(DateUtils.getCurrentDate(), 4);

    console.log({ textToDate })
    console.log({ cognitoUserId, body });

    const randomNumbers: number[] = Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1);
    const randomSum = randomNumbers.reduce((acc, n) => acc + n, 0);
    console.log('Generated 5 random numbers:', randomNumbers, 'sum:', randomSum);
    const cognicoCompleted = `${cognitoUserId}${randomNumbers.join('')}`;
    console.log({ cognicoCompleted });

    if (body.type === 'cash')
      finalCode = this.generateCashReference(cognicoCompleted, body, textToDate);
    else if (body.type === "spei")
      finalCode = await this.stpService.getCLABE(+body.id);
    else
      throw new Error('Tipo de referencia no soportado');

    let register = false;

    // const existingReferenceActive = await this.referencesUsecasesProxy
    //   .getInstance()
    //   .findRecorsUsersReferences(body);
    const existingReferenceActive = await this.prisma.references.findMany({
      where: {
        user_id: body.id,
        type_operation: body.type,
        status: 'active'
      }
    })

    const activeItem = existingReferenceActive.find(
      item => item.status.toLowerCase() === 'active',
    );

    console.log({ existingReferenceActive, activeItem })
    if (activeItem) {
      const dateCreated = new Date(activeItem.date_created);
      console.log({ dateCreated })
      const diffHours = DateUtils.getDifferenceInHours(DateUtils.getCurrentDate(), dateCreated);
      console.log({ diffHours })
      if (diffHours > 24) {
        register = true;
        // await this.referencesUsecasesProxy
        //   .getInstance()
        //   .updateRecordReferences(
        //     body,
        //     activeItem.reference,
        //     activeItem.id,
        //     finalCode,
        //   );
        if (finalCode != activeItem.reference.toString()) {
          await this.prisma.references.updateMany({
            where: {
              id: activeItem.id
            },
            data: {
              status: 'expired',
              reference: finalCode
            }
          })
        } else {
          throw new Error('La referencia generada es la misma que la activa');
        }
      } else {
        register = false;
      }
    } else {
      register = true;
    }
    if (register) {
      // const result = await this.referencesUsecasesProxy
      //   .getInstance()
      //   .setRecorsUserReference(body, finalCode);
      const result = await this.prisma.references.create({
        data: {
          user_id: body.id,
          amount: body.amount,
          reference: finalCode,
          date_created: DateUtils.getCurrentDate().toISOString(),
          status: 'active',
          type_operation: body.type
        }
      })
      return {
        status: 'ok',
        id: result.id.toString(),
        code: finalCode,
        date: textToDate.toISOString(),
        type_operation: 'none',
      };
    } else {
      return {
        status: 'Exist',
        id: activeItem?.id?.toString() ?? '',
        code: activeItem?.reference ?? '',
        date: activeItem?.date_created ?? '',
        type_operation: activeItem?.type_operation ?? '',
      };
    }
  }

  private generateCashReference(cognitoUserId: string, body: referDto, textToDate: Date): string {
    console.log({ cognitoUserId, body, textToDate });
    const codeRefBase = this.generateCashBaseReference(cognitoUserId);
    console.log({ codeRefBase });

    //step dateCompensated
    const dateCompensated =
      (textToDate.getFullYear() - 2014) * 372 +
      textToDate.getMonth() * 31 +
      (textToDate.getDate() - 1);
    console.log({ dateCompensated });

    //reform text
    let clearFormat = body.amount
      .toString()
      .replaceAll(',', '')
      .replaceAll('.', '');

    console.log({ bodyAmount: body.amount.toString() });
    console.log({ clearFormat });

    //weighting
    let oneVerify = 0;
    clearFormat = clearFormat.split('').reverse().join('');
    for (let i = 0; i < clearFormat.length; i += 3) {
      const element1 = parseInt(clearFormat[i]);
      oneVerify += !isNaN(element1) ? element1 * 7 : 0;
      const element2 = parseInt(clearFormat[i + 1]);
      oneVerify += !isNaN(element2) ? element2 * 3 : 0;
      const element3 = parseInt(clearFormat[i + 2]);
      oneVerify += !isNaN(element3) ? element3 * 1 : 0;
    }

    console.log({ oneVerify });

    const wasteOne = oneVerify % 10;
    console.log({ wasteOne });

    //create new code
    let newCode =
      codeRefBase.toString() +
      dateCompensated.toString() +
      wasteOne.toString() +
      '2';

    //second weighting
    console.log({ newCode });

    let twoVerify = 0;

    newCode = newCode.split('').reverse().join('');

    console.log({ newCode });

    for (let i = 0; i < newCode.length; i += 5) {
      const element1 = parseInt(newCode[i]);
      twoVerify += !isNaN(element1) ? element1 * 11 : 0;
      const element2 = parseInt(newCode[i + 1]);
      twoVerify += !isNaN(element2) ? element2 * 13 : 0;
      const element3 = parseInt(newCode[i + 2]);
      twoVerify += !isNaN(element3) ? element3 * 17 : 0;
      const element4 = parseInt(newCode[i + 3]);
      twoVerify += !isNaN(element4) ? element4 * 19 : 0;
      const element5 = parseInt(newCode[i + 4]);
      twoVerify += !isNaN(element5) ? element5 * 23 : 0;
    }
    console.log({ twoVerify });

    //reform text
    newCode = newCode.split('').reverse().join('');

    console.log({ newCode });

    const wasteTwo =
      (twoVerify % 97) + 1 > 9
        ? (twoVerify % 97) + 1
        : '0' + ((twoVerify % 97) + 1);

    console.log({ wasteTwo });

    const finalCode = newCode.toString() + wasteTwo.toString();
    console.log({ finalCode });

    return finalCode;

  }

  private generateCashBaseReference(userId: string): string {
    const numbers = userId.replace(/\D/g, '').slice(0, 12);
    console.log('Generated base reference numbers:', numbers);
    console.log('Filled base reference numbers:', fillWithZeros(numbers, 12));
    return fillWithZeros(numbers, 12);
  }

  async getSpeiReference(email: string) {
    try {
      console.log('Getting SPEI reference for email:', email);
      const result = await this.prisma.stp_clabe.findFirst({
        where: {
          user: { email: email }
        },
      })
      return result;
    } catch (error) {
      console.error('Error in getSpeiReference:', error);
      throw new Error(`Error fetching SPEI reference: ${error.message}`);
    }
  }

  async getReferenceIfExist(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email }
      });
      if (!user) {
        throw new Error('User not found');
      }
      const reference = await this.prisma.references.findFirst({
        where: {
          user_id: user.id,
          status: 'active',
          type_operation: 'cash'
        },
        orderBy: {
          date_created: 'desc',
        },
      });
      console.log('Active reference found:', reference);
      return reference;
    } catch (error) {
      console.error('Error in getReferenceIfExist:', error);
      throw new Error(`Error fetching reference: ${error.message}`);
    }
  }

  async deleteReference(id: string) {
    try {
      // const user = await this.userVerifiedServices.findUserByEmail(email);
      // if (!user) {
      //   throw new Error('User not found');
      // }
      const updated = await this.prisma.references.updateMany({
        where: {
          id: id,
          status: 'active',
          type_operation: 'cash'
        },
        data: {
          status: 'Canceled',
        },
      });
      return { updatedCount: updated.count };
    } catch (error) {
      console.error('Error in deleteReference:', error);
      throw new Error(`Error updating reference status: ${error.message}`);
    }
  }
  async getPhisycalCardStatus(email: string) {
    try {
      console.log('Getting physical card status for email:', email);
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const result = await this.prisma.requests_physic_card.findFirst({
        where: {
          user_id: getPomeloInfo.id
        },
        orderBy: {
          id: 'desc'
        }
      })
      const userCard = await this.prisma.user_cards.findFirst({
        where: {
          user_id: getPomeloInfo.id,
          type: 'physical_requested'
        },
        orderBy: {
          id: 'desc'
        }
      })
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/v1/${getPomeloInfo.physical_card_id}`;
      const info = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        }
      })
        .then(response => response.json());

      console.log('userCard', userCard);
      console.log('result', result);
      return { ...result, ...userCard, ...info };
    } catch (error) {
      console.error('Error in getPhisycalCardStatus:', error);
      throw new Error(`Error fetching physical card status: ${error.message}`);
    }
  }

  async getVirtualCardStatus(email: string) {
    try {
      console.log('Getting physical card status for email:', email);
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const tokenData = await this.getPomeloToken();
      const url = `${this.pomeloUrl}/cards/v1/${getPomeloInfo.virtual_card_id}`;
      const info = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        }
      })
        .then(response => response.json());
      return { ...info, };
    } catch (error) {
      console.error('Error in getPhisycalCardStatus:', error);
      throw new Error(`Error fetching physical card status: ${error.message}`);
    }
  }

  async verifyIdentity(email: string) {
    try {
      console.log('Verifying identity for email:', email);
      // const getPomeloInfo = await this.userVKCSerifiedServices.getPomeloInfoByEmail(email);
      const lastEntry = await this.prisma.data_validation_result.findFirst({
        orderBy: { id: 'desc' },
      });
      const nextId = lastEntry ? lastEntry.id + 1 : 1;
      await this.prisma.data_validation_result.create({
        data: {
          id: nextId,
          process_id: `proc-${Date.now()}-verify-identity-success`,
          email_user: email,
        }
      })
      return true;
    }
    catch (error) {
      console.error('Error in verifyIdentity:', error);
      throw new Error(`Error verifying identity: ${error.message}`);
    }
  }

  async saveSign(email: string) {
    try {
      console.log('Saving sign for email:', email);
      // Get the last entry to determine the next id
      const lastEntry = await this.prisma.signing_result.findFirst({
        orderBy: { id: 'desc' },
      });
      const nextId = lastEntry ? lastEntry.id + 1 : 1;
      await this.prisma.signing_result.create({
        data: {
          id: nextId,
          event_type: 'doc_start',
          email: email,
          object: '', // Provide appropriate value if needed
          contract_token: '', // Provide appropriate value if needed
        }
      });
      return true;
    } catch (error) {
      console.error('Error in saveSign:', error);
      throw new Error(`Error saving sign: ${error.message}`);
    }
  }

  async createRefinancing(monto, tasaAnual = 50) {
    try {
      const comission = 100 * 1.16;

      const mesesNum1 = 3
      const mesesNum2 = 6
      const tasaMensual = tasaAnual / 12;

      const factor = Math.pow(1 + tasaMensual, mesesNum1);
      const mensualidad = monto * (tasaMensual * factor) / (factor - 1);

      const factor2 = Math.pow(1 + tasaMensual, mesesNum2);
      const mensualidad2 = monto * (tasaMensual * factor2) / (factor2 - 1);

      // Redondear a 2 decimales
      console.log({
        3: parseFloat(mensualidad.toFixed(2)),
        6: parseFloat(mensualidad2.toFixed(2))
      })
      return {
        3: parseFloat(mensualidad.toFixed(2)),
        6: parseFloat(mensualidad2.toFixed(2))
      }
    } catch (error) {
      console.error('Error in createRefinancing:', error);
    }
  }

  getNextDates(startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Función auxiliar para encontrar el próximo día de la semana
    function getNextDayOfWeek(fromDate, dayOfWeek) {
      const result = new Date(fromDate);
      const currentDay = result.getDay();
      let daysToAdd = (dayOfWeek - currentDay + 7) % 7;
      // Si hoy es el día buscado, no sumar días
      if (daysToAdd === 0) {
        return result;
      }
      result.setDate(result.getDate() + daysToAdd);
      return result;
    }

    // Si hoy es viernes (5) o sábado (6), mantener las fechas actuales hasta el domingo
    let paymentDate, cutoffDate;
    if (today.getDay() === 5 || today.getDay() === 6) {
      // Hoy es viernes o sábado
      paymentDate = getNextDayOfWeek(today, 6); // Sábado (puede ser hoy)
      cutoffDate = getNextDayOfWeek(today, 5); // Viernes (puede ser hoy)
    } else {
      // Buscar el próximo viernes y sábado
      cutoffDate = getNextDayOfWeek(today, 5);
      paymentDate = getNextDayOfWeek(today, 6);
    }

    // El inicio del ciclo de corte actual es el viernes anterior (o el actual si es viernes)
    let startCurrentCutDate = new Date(cutoffDate);
    startCurrentCutDate.setDate(cutoffDate.getDate() - 7);

    return {
      paymentDate,
      cutoffDate,
      startCurrentCutDate
    };
  }

  async verifyMoralityAll() {
    try {
      console.log('Verifying morality for all users');
      const users = await this.prisma.user.findMany({
        orderBy: { id: 'desc' },
        take: 5,
      });
      for (const user of users) {
        console.log('Verifying user:', user.email);
        const userInfo = await this.userVerifiedServices.findUserByEmail(user.email);
        const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(user.email);
        console.log('userInfo', userInfo);
        const cards = await this.getPomeloCardsByUser(getPomeloInfo.pomelo_user_id);
        console.log('cards', cards);
        // const pomeloBalance = await this.getPomeloUserCredit(getPomeloInfo.sod_id);
        const pomeloBalance = await this.getPomeloAccountById(getPomeloInfo.sod_id);
        console.log('pomeloBalance', JSON.stringify(pomeloBalance));

        const startDate = new Date('2025-10-06'); // Fecha de inicio
        const { paymentDate, cutoffDate, startCurrentCutDate } = this.getNextDates(startDate);

        console.log('Fecha de pago próxima:', paymentDate.toLocaleDateString());
        console.log('Fecha de corte próxima:', cutoffDate.toLocaleDateString());

        // Calcular el pago mínimo según las reglas:
        console.log('userInfo', userInfo);
        let isPayment = false;
        const imputaciones = await this.getActivities(getPomeloInfo.sod_id);
        let amountDebt = 0;
        imputaciones?.data?.forEach((element) => {
          console.log('element', element);
          if (element.type === 'CASHOUT') {
            amountDebt += Number(element.total_amount) || 0;
          }
          if (
            element.type === 'CASHIN' &&
            new Date(element.created_at) >= startCurrentCutDate &&
            new Date(element.created_at) <= cutoffDate
          ) {
            isPayment = true;
          }
        });
        console.log('isPayment', isPayment);
        if (!isPayment && amountDebt > 0) {
          const amount = 299
          const iva = amount * 0.16;
          const total = amount + iva;
          const transactionInitial: CreateTransactionDto = {
            account_id: user?.sod_id || '',
            type: "CASHOUT",
            process_type: "ORIGINAL",
            data: {
              tx_properties: {
                network_name: "Dey",
              },
              description: {
                "en-US": "Comision por pago tardio"
              },
              details: [
                {
                  amount: (total).toFixed(2).toString(),
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
            total_amount: (total).toFixed(2).toString(),
          };
          try {
            const response = await this.prisma.transaction.create({
              data: {
                id: uuidv4(),
                amount: amount,
                iva_value: iva,
                commission_value: 0,
                status: 3,
                entity: 69,
                reference: undefined,
                details: `Comision por pago tardio`,
                cycle_id: undefined,
                balance: 100,
                debt: total,
                user_id: user.id,
                transaction_commission_id: 1,
                provider_id: undefined,
                mo_export: false,
              },
            });
            const transactionInitialResponse = await this.createPomeloTransaction(transactionInitial);
          } catch (error) {
            console.error('Error creating initial transaction in Pomelo:', error);
          }
        }
      }
      return true;
    }
    catch (error) {
      console.error('Error in verifyMoralityAll:', error);
      throw new Error(`Error verifying morality for all users: ${error.message}`);
    }
  }

  async deleteAccount(email: string) {
    try {
      console.log('Deleting account for email:', email);
      const getPomeloTokenData = await this.getPomeloToken();
      const getPomeloInfo = await this.userVerifiedServices.getPomeloInfoByEmail(email);
      const url = `${this.pomeloUrl}/users/v1/${getPomeloInfo.pomelo_user_id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getPomeloTokenData.access_token}`,
        },
        body: JSON.stringify({
          status: "BLOCKED",
          status_reason: "CLIENT_INTERNAL_REASON"
        })
      });
      console.log('Delete account response status:', response.status);

      // await this.updatePomeloCard({
      //   card_id: getPomeloInfo.virtual_card_id,
      //   status: "BLOCKED",
      //   status_reason: "CLIENT_INTERNAL_REASON"
      // });
      return { status: 'Account deleted successfully', success: true };

    } catch (error) {
      console.error('Error in deleteAccount:', error);
      throw new Error(`Error deleting account: ${error.message}`);
    }
  }

  async getCobranzaCard(email: string) {
    try {
      console.log('Getting Cobranza card for email:', email);
      const getCobranzaCard = await this.prisma.users_info_card.findFirst({
        where: {
          email: email
        },
        orderBy: {
          id: 'desc'
        }
      })
      return getCobranzaCard;
    } catch (error) {
      console.error('Error in getCobranzaCard:', error);
      throw new Error(`Error fetching Cobranza card: ${error.message}`);
    }
  }

}

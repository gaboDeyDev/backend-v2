// import { HttpService } from '@nestjs/axios';
// import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
// import { firstValueFrom } from 'rxjs';
// import { decode } from 'jsonwebtoken';
// import { MoService } from '../mo/mo.service';
// import { VerifiedUser } from 'src/domain/entities/userVerified';
// import { CreditAssignmentResponse } from 'src/domain/model/CreditAsignamentModel';
// import { CreateCustomerDto } from 'src/infrastructure/dto/mo.dto';
// import {
//   CreateCustomerResponse,
//   GetCustomerInformationResponse,
//   ProductData,
// } from 'src/domain/model/moModels';
// import { createCustomerInformationDto } from 'src/infrastructure/dto/customerInformation.dto';
// import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
// import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
// import { CustomerInformationUseCases } from 'src/usecases/customerInformation.usecases';
// import { CreditAssignmentService } from '../credit-assignment/credit-assignment.service';
// import { UserVerifiedService } from '../user-verified/user-verified.service';
// import { UserService } from '../user/user.service';
// import { CreditService } from '../credit/credit.service';
// import { FetchHttpService } from '../fetch-http/fetch-http.service';
// import { ContractVariableUseCases } from 'src/usecases/contractVariable.usecase';
// import * as numeroALetras from 'numero-a-letras';
// import { UserVerifiedUseCases } from 'src/usecases/userVerified.usecase';
// import { UserPublicityUseCases } from 'src/usecases/userPublicity.usecase';
// import { TruoraAttemptsUseCases } from 'src/usecases/truoraAttempts.usecase';

// import moment from 'moment-timezone';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { CreatePomeloUserDto } from 'src/pomelo/dto/create-pomelo-user.dto';
// import { CreatePomeloAccountDto } from 'src/pomelo/dto/create-pomelo-account.dto';
import { CreatePomeloCardDto } from 'src/pomelo/dto/create-pomelo-card.dto';
import { CreatePomeloAssociationDto } from 'src/pomelo/dto/create-pomelo-association.dt';
import { CreatePomeUserCreditDto } from 'src/pomelo/dto/create-pomelo-user-credit.dt';
import { Console } from 'console';
import { verified_user } from '@prisma/client';
import { UserService } from './user.service';
import { UserVerifiedService } from './user-verified.service';
import { CreditAssignmentService } from './credit-assignment.service';
import { PrismaService } from 'src/prisma/prisma.service';
const axios = require('axios');
import * as numeroALetras from 'numero-a-letras';
import { CreatePomeloAccountDto } from 'src/pomelo/dto/create-pomelo-account.dto';
import { CreateTransactionDto } from 'src/pomelo/dto/create-transaction';
import * as ejs from 'ejs';
import * as puppeteer from 'puppeteer';
import { NotificationsService } from './notofocations-service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

// Add missing TruoraJWT type definitions
interface TruoraJWT {
  account_id: string;
  additional_data: string;
  client_id: string;
  exp: number;
  grant: string;
  iat: number;
  iss: string;
  jti: string;
  key_name: string;
  key_type: string;
  username: string;
}

interface TruoraJWTAdditionalDataParsed {
  country: string;
  flow_id: string;
  redirect_url: string;
  process_id: string;
}

@Injectable()
export class TruoraService {
  private transactionUrl: string;
private s3: S3Client;

  constructor(
    // private readonly httpService: HttpService,
    // private readonly moService: MoService,
    // @Inject(UsecasesProxyModule.CONTRACT_VARIABLE_USECASES_PROXY)
    // private readonly contractVariableUsecasesProxy: UseCaseProxy<ContractVariableUseCases>,
    // @Inject(UsecasesProxyModule.USER_USECASES_PROXY)
    // private readonly userUsecasesProxy: UseCaseProxy<UserVerifiedUseCases>,
    // @Inject(UsecasesProxyModule.USER_PUBLICITY_USECASES_PROXY)
    // private readonly userPublicityUsecasesProxy: UseCaseProxy<UserPublicityUseCases>,
    private readonly creditAssignmentService: CreditAssignmentService,
    private readonly userVerifiedService: UserVerifiedService,
    private readonly userService: UserService,
    // private readonly creditService: CreditService,
    // private readonly fetchHttpService: FetchHttpService,
    private readonly pomeloService: PomeloService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {
      this.s3 = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
    },
  });
    // this.transactionUrl = this.configService.get('TRANS_URL');
  }

  async generateValidationLink(email: string) {
    try {
      const user = await this.userVerifiedService.findUserByEmail(email);
      const encodedData = new URLSearchParams({
        key_type: 'web',
        api_key_version: '1',
        country: 'ALL',
        grant: 'digital-identity',
        // flow_id: process.env.TRUORA_FLOW_ID ?? '',
        flow_id: this.configService.get('TRUORA_FLOW_ID') ?? '',
        // redirect_url: process.env.TRUORA_REDIRECT_URL ?? '',
        redirect_url: this.configService.get('TRUORA_REDIRECT_URL') ?? '',
        account_id: user.curp || '',
      }).toString();

      // Define the expected response type for clarity (optional, but recommended)
      type TruoraGenerateAPIKeyResponse = {
        api_key: string;
      };

      const response = await axios.post(
        // `${process.env.TRUORA_ACCOUNT_URL}/v1/api-keys`,
        `${this.configService.get('TRUORA_ACCOUNT_URL')}/v1/api-keys`,
        encodedData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Truora-API-Key': process.env.TRUORA_API_KEY,
            'Truora-API-Key': this.configService.get('TRUORA_API_KEY'),
            // 'Truora-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiIiwiYWRkaXRpb25hbF9kYXRhIjoie30iLCJjbGllbnRfaWQiOiJUQ0ljY2JjOTIyZjlkMTBmY2I3ODcyY2EwZWNmNWRlNmQwMCIsImV4cCI6MzI4NDcyOTczMSwiZ3JhbnQiOiIiLCJpYXQiOjE3MDc5Mjk3MzEsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0xX0V3eXNMM0lBcCIsImp0aSI6IjRkNTc1MmVjLTliNzItNGE3Yi05NDQ0LTA0YjQ2MDVjNWFhOCIsImtleV9uYW1lIjoiYXBwZGV5Iiwia2V5X3R5cGUiOiJiYWNrZW5kIiwidXNlcm5hbWUiOiJkZXltZXgtYXBwZGV5In0.ku25gURGTqf5AUPoG_C-puuFaYPPK7Ulwo2VLB1wJz0',
          },
        },
      );
      const {
        data: { api_key },
      } = response as { data: TruoraGenerateAPIKeyResponse };

      const { process_id } = JSON.parse(
        (decode(api_key) as TruoraJWT).additional_data,
      ) as TruoraJWTAdditionalDataParsed;

      return {
        // url: `${process.env.TRUORA_IDENTITY_URL}/?token=${api_key}`,
        url: `${this.configService.get('TRUORA_IDENTITY_URL')}/?token=${api_key}`,
        process_id,
        api_key,
      };
    } catch (error) {
      console.error('Error generating validation link:', error);
      throw error;
    }
  }

  async createDocument(email: string, is_publicity: boolean) {
    try {
      const userVerified =
        await this.userVerifiedService.findUserByEmail(email);
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });
      const contractInfo = await this.prisma.contract_variable.findMany({
        where: { type: 'sindicatos' },
      });
      const stpAccount = await this.prisma.stp_clabe.findFirst({
        where: { user_id: userVerified.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const dataForContract = {
        sueldo: Number((Number(user.salary) * 0.3).toFixed(2)),
        sueldo2: numeroALetras.NumerosALetras(
          Number((Number(user.salary) * 0.3).toFixed(2)),
          {
            plural: 'pesos',
            singular: 'peso',
            centPlural: 'centavos',
            centSingular: 'centavo',
          },
        ),
        porcientoNumero: '8.00',
        porcientoLetra: 'ocho',
        contractInfo,
        contratoNumero: `DEY-${Math.floor(100000 + Math.random() * 900000)}`,
        nombreCompleto: `${userVerified.names} ${userVerified.fathers_lastname} ${userVerified.mothers_lastname}`,
        rfc: userVerified.rfc,
        curp: userVerified.curp,
        cuentaNumero: stpAccount?.clabe || '000000000000000000',
        fecha: new Date().toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };

      // Función para obtener valor de comisión por nombre
      const getCommissionValue = (name: string) => {
        const commission = dataForContract?.contractInfo?.find(
          (item: any) => item.name === name,
        );
        return commission?.value || '';
      };

      const response = await axios.post(
        // `${process.env.ZAPSIGN_URL}/models/create-doc/`,
        `${this.configService.get('ZAPSIGN_URL')}/models/create-doc/`,
        {
          // template_id: process.env.TRUORA_TEMPLATE_ID,
          template_id: this.configService.get('TRUORA_TEMPLATE_ID'),
          // template_id: '46e4862f-d8c7-44aa-87e9-8da7e984db89',
          signer_name: dataForContract.nombreCompleto,
          signer_email: email,
          send_automatic_email: true,
          send_automatic_whatsapp: false,
          lang: 'es',
          external_id: user.id.toString(),
          data: [
            {
              de: '{{CAT}}',
              para:
                dataForContract?.contractInfo?.find(
                  (item: any) => item.name === 'CAT',
                )?.value || '',
            },
            {
              de: '{{TASAORDINARIA}}',
              para:
                dataForContract?.contractInfo?.find(
                  (item: any) => item.name === 'TASAORDINARIA',
                )?.value || '',
            },
            {
              de: '{{SUELDO}}',
              para: dataForContract?.sueldo?.toString() || '',
            },
            { de: '{{SUELDO2}}', para: dataForContract?.sueldo2 || '' },
            {
              de: '{{PORCIENTO_NUMERO}}',
              para: dataForContract?.porcientoNumero
                ? dataForContract.porcientoNumero + '     '
                : '',
            },
            {
              de: '{{PORCIENTO_LETRA}}',
              para: dataForContract?.porcientoLetra || '',
            },
            { de: '{{COMISIONT1}}', para: getCommissionValue('COMISIONT1') },
            { de: '{{COMISIONT2}}', para: getCommissionValue('COMISIONT2') },
            { de: '{{COMISIONT3}}', para: getCommissionValue('COMISIONT3') },
            { de: '{{COMISIONT4}}', para: getCommissionValue('COMISIONT4') },
            { de: '{{COMISIONT5}}', para: getCommissionValue('COMISIONT5') },
            { de: '{{COMISIONT6}}', para: getCommissionValue('COMISIONT6') },
            { de: '{{COMISIONT7}}', para: getCommissionValue('COMISIONT7') },
            { de: '{{COMISIONT8}}', para: getCommissionValue('COMISIONT8') },
            { de: '{{CONTRATO}}', para: dataForContract?.contratoNumero || '' },
            { de: '{{NOMBRE}}', para: dataForContract?.nombreCompleto || '' },
            { de: '{{RFC}}', para: dataForContract?.rfc || '' },
            { de: '{{CURP}}', para: dataForContract?.curp || '' },
            { de: '{{CUENTA}}', para: dataForContract?.cuentaNumero || '' },
            { de: '{{TASADIFERIR}}', para: getCommissionValue('TASADIFERIR') },
            {
              de: '{{TASAREFINANCIAR}}',
              para: getCommissionValue('TASAREFINANCIAR'),
            },
            { de: '{{FECHA}}', para: dataForContract?.fecha || '' },
            { de: '{{FIRMA}}', para: dataForContract?.nombreCompleto || '' },
            { de: '{{FIRMA2}}', para: 'AMÉRICA ROSETE CID' },
            { de: '{{PUBLICIDADSI}}', para: 'X' },
            { de: '{{PUBLICIDADNO}}', para: '' },
          ],
        },
        {
          headers: {
            // Authorization: `Bearer ${process.env.ZAPSIGN_API_KEY}`,
            Authorization: `Bearer ${this.configService.get('ZAPSIGN_API_KEY')}`,
            // Authorization: `Bearer 6e66f8c4-e14d-48b5-b858-0fdc73e6b9625ec36d38-76c3-4b9e-bb76-8041c3a2551f`,
          },
        },
      );
      const { data } = response;

      // Check if user_publicity already exists for this user before creating
      // if (is_publicity) {
      //   const existingPublicity = await this.prisma.user_publicity.findFirst({
      //     where: { user_id: getUser?.id || 0 }
      //   });
      //   if (!existingPublicity) {
      //     await this.prisma.user_publicity.create({
      //       data: {
      //         user_id: getUser?.id || 0,
      //         acceptance_date: new Date().toISOString(),
      //       }
      //     });
      //   }
      // }

      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async getContractInfo(email: string) {
    const userVerified = await this.userVerifiedService.findUserByEmail(email);
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    const contractInfo = await this.prisma.contract_variable.findMany({
      where: { type: 'sindicatos' },
    });
    const stpAccount = await this.prisma.stp_clabe.findFirst({
      where: { user_id: userVerified.id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const sueldoNumber = Number((Number(user.salary) * 0.3).toFixed(2));
    const sueldo = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(sueldoNumber); // formatted without the "$" symbol

    return {
      sueldo: sueldo, // e.g. "3,000.00"
      sueldo2: numeroALetras.NumerosALetras(sueldoNumber, {
        plural: 'pesos',
        singular: 'peso',
        centPlural: 'centavos',
        centSingular: 'centavo',
      }),
      porcientoNumero: '8.00',
      porcientoLetra: 'ocho',
      contractInfo,
      contratoNumero: `DEY-${Math.floor(100000 + Math.random() * 900000)}`,
      nombreCompleto: `${userVerified.names} ${userVerified.fathers_lastname} ${userVerified.mothers_lastname}`,
      rfc: userVerified.rfc,
      curp: userVerified.curp,
      cuentaNumero: stpAccount?.clabe || '000000000000000000',
      fecha: new Date().toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }

  public async moCustomerCreation(userEmail: string): Promise<boolean> {
    const user: verified_user =
      await this.userVerifiedService.findUserByEmail(userEmail);
    const userSalary = await this.userService.getUserSalary(userEmail);
    const res = this.creditAssignmentService.CreditAssigment(user, userSalary);

    const userId = await this.userService.getUserId(userEmail);

    const isCustomerAlreadyExist = await this.isCustomerCreated(String(userId));

    const canCreateCustomer = !isCustomerAlreadyExist;

    if (canCreateCustomer) {
      const userObj: CreatePomeloUserDto = {
        name: user.names,
        surname: user.fathers_lastname + ' ' + user.mothers_lastname,
        identification_type: String(user.identitytype),
        identification_value: String(user.identitynumber),
        birthdate: new Date(user.birth_date).toISOString().slice(0, 10), // yyyy-mm-dd
        gender: user.gender.toUpperCase(),
        email: user.email,
        phone: user.phone,
        tax_identification_type: 'RFC',
        tax_identification_value: user.rfc,
        nationality: 'MEX',
        tax_condition: 'VAT_REGISTERED',
        legal_address: {
          street_name: user.legal_street_name ?? '',
          street_number: Number(user.legal_street_number),
          floor: Number(user.legal_floor),
          apartment: user.legal_apartment ?? 'Sin información',
          zip_code: Number(user.legal_zip_code),
          neighborhood: user.legal_neighborhood ?? '',
          city: user.legal_city ?? '',
          region: user.legal_region ?? '',
          // municipality: user.legal_municipality,
          additional_info: user.legal_additional_info
            ? user.legal_additional_info === ''
              ? 'Sin información'
              : user.legal_additional_info
            : 'Sin información',
          country: 'MEX',
        },
        operation_country: 'MEX',
      };

      const userResponse = await this.pomeloService.createUserPomelo(userObj);

      // this.creatingCustomerInMO(user, String(userId), res, cutoff_date);
      const pomeloAccountId = userResponse.data.id;

      const createPomeloCardDto: CreatePomeloCardDto = {
        user_id: pomeloAccountId,
        affinity_group_id: 'afg-340kRdG86orr5UDuzzJOKocKBKW',
        card_type: 'VIRTUAL',
        address: {
          street_name: user.legal_street_name ?? '',
          street_number: String(user.legal_street_number),
          floor: String(user.legal_floor),
          apartment: user.legal_apartment ?? 'Sin información',
          city: user.legal_city ?? '',
          region: user.legal_region ?? '',
          country: 'MEX',
          zip_code: String(user.legal_zip_code),
          neighborhood: user.legal_neighborhood ?? '',
          additional_info: user.legal_additional_info ?? 'Sin información',
        },
        pin: '8640',
      };

      const createPomeloCardResponse =
        await this.pomeloService.createPomeloCard(createPomeloCardDto);


      const creditAssignmentResponse: CreatePomeUserCreditDto = {
        user_id: pomeloAccountId,
        product_id: 'lpr-30RLvlFnBYB9Cx9mkhsIazi9Rzn',
        limits: {
          single_payment: 20000,
          cash_advance_percentage: 10,
          cash_advance: 32500,
          installments: 30000,
        },
        offer_start_date: '2022-04-20',
        offer_end_date: '2029-05-20',
        due_date: 15,
        user_scoring: 'A',
        person_type: 'NATURAL',
      };

      const creditAssignmentResponsePomelo =
        await this.pomeloService.createPomeloUserCredit(
          creditAssignmentResponse,
        );


      const createPomeloAssociationDto: CreatePomeloAssociationDto = {
        card_id: createPomeloCardResponse.data.id,
        credit_line_id: creditAssignmentResponsePomelo.data.id,
      };


      const createPomeloAssociationResponse =
        await this.pomeloService.createPomeloAssociation(
          createPomeloAssociationDto,
        );

    }

    return canCreateCustomer;
  }

  public async pomeloCustomerCreation(userEmail: string): Promise<boolean> {
    const user: verified_user =
      await this.userVerifiedService.findUserByEmail(userEmail);
    const userSalary = await this.userService.getUserSalaryAndCat(userEmail);
    // const res = this.creditAssignmentService.CreditAssigment(user, userSalary);

    const userId = await this.userVerifiedService.getUserIdForPomelo(userEmail);

    // const isCustomerAlreadyExist = await this.isCustomerCreated(String(userId));

    // const canCreateCustomer = !isCustomerAlreadyExist;

    // if (canCreateCustomer) {

    let createPomeloCardResponse: any;
    let creditAssignmentResponsePomelo: any;
    let createPomeloAccountResponse: any;
    let userResponse: any;
    try {
      const userObj: CreatePomeloUserDto = {
        name: user.names,
        surname: user.fathers_lastname + ' ' + user.mothers_lastname,
        identification_type: String(user.identitytype),
        identification_value: String(user.identitynumber),
        birthdate: new Date(user.birth_date).toISOString().slice(0, 10), // yyyy-mm-dd
        gender: user.gender.toUpperCase(),
        email: user.email,
        phone: user.phone,
        tax_identification_type: 'RFC',
        tax_identification_value: user.rfc,
        nationality: 'MEX',
        tax_condition: 'VAT_REGISTERED',
        legal_address: {
          street_name: user.legal_street_name ?? '',
          street_number: Number(user.legal_street_number),
          floor: user.legal_floor
            ? user.legal_floor === ''
              ? 0
              : Number(user.legal_floor)
            : 0,
          apartment: user.legal_apartment
            ? user.legal_apartment === ''
              ? 'Sin información'
              : user.legal_apartment
            : 'Sin información',
          zip_code: Number(user.legal_zip_code),
          neighborhood: user.legal_neighborhood ?? '',
          city: user.legal_city ?? '',
          region: user.legal_region ?? '',
          // municipality: user.legal_municipality,
          additional_info: user.legal_additional_info ?? 'Sin información',
          country: 'MEX',
        },
        operation_country: 'MEX',
      };

      userResponse = await this.pomeloService.createUserPomelo(userObj);

      // this.creatingCustomerInMO(user, String(userId), res, cutoff_date);
      const pomeloAccountId = userResponse.data.id;

      const createPomeloCardDto: CreatePomeloCardDto = {
        user_id: pomeloAccountId,
        affinity_group_id: 'afg-340kRdG86orr5UDuzzJOKocKBKW',
        card_type: 'VIRTUAL',
        address: {
          street_name: user.legal_street_name ?? '',
          street_number: String(user.legal_street_number),
          floor: user.legal_floor
            ? user.legal_floor === ''
              ? 'Sin información'
              : user.legal_floor
            : 'Sin información',
          apartment: user.legal_apartment
            ? user.legal_apartment === ''
              ? 'Sin información'
              : user.legal_apartment
            : 'Sin información',
          city: user.legal_city ?? '',
          region: user.legal_region ?? '',
          country: 'MEX',
          zip_code: String(user.legal_zip_code),
          neighborhood: user.legal_neighborhood ?? '',
          additional_info: user.legal_additional_info ?? 'Sin información',
        },
        pin: '8640',
      };

      createPomeloCardResponse =
        await this.pomeloService.createPomeloCard(createPomeloCardDto);
      if (!createPomeloCardResponse || createPomeloCardResponse.error) {
        throw new Error(
          'Error creating Pomelo card: ' +
            (createPomeloCardResponse?.error?.details[0]?.detail ||
              'Unknown error'),
        );
      }

      const today = new Date();
      const offer_start_date = today.toISOString().slice(0, 10); // yyyy-mm-dd
      const offer_end_date = new Date(
        today.setFullYear(today.getFullYear() + 5),
      )
        .toISOString()
        .slice(0, 10); // +5 years

      // const creditAssignmentResponse: CreatePomeUserCreditDto = {
      //   user_id: pomeloAccountId,
      //   product_id: "lpr-30RLvlFnBYB9Cx9mkhsIazi9Rzn",
      //   limits: {
      //     single_payment: Number(userSalary.user.salary) * 0.3,
      //     cash_advance_percentage: 10,
      //     cash_advance: Number(userSalary.user.salary) * 0.3,
      //     installments: Number(userSalary.user.salary) * 0.3,
      //   },
      //   offer_start_date,
      //   offer_end_date,
      //   due_date: 15,
      //   user_scoring: "A",
      //   person_type: "NATURAL"
      // };
      // creditAssignmentResponsePomelo = await this.pomeloService.createPomeloUserCredit(creditAssignmentResponse);
      // if (!creditAssignmentResponsePomelo || creditAssignmentResponsePomelo.error) {
      //   throw new Error('Error creating Pomelo credit line: ' + (creditAssignmentResponsePomelo?.error?.details[0]?.detail || 'Unknown error'));
      // }
      const creditAssignmentResponse: CreatePomeloAccountDto = {
        owner_type: 'USER',
        user_id: pomeloAccountId,
        country: 'MEX',
        currency: 'MXN',
        metadata: {
          external_id: String(userId),
        },
      };

      const idempotencyKey = `pomelo-account-${pomeloAccountId}-${Date.now()}`;
      creditAssignmentResponsePomelo =
        await this.pomeloService.createPomeloAccount(
          creditAssignmentResponse,
          idempotencyKey,
        );


      const createPomeloAssociationDto: CreatePomeloAssociationDto = {
        card_id: createPomeloCardResponse.data.id,
        account_id: creditAssignmentResponsePomelo.data.id,
      };

      try {

        const createPomeloAssociationResponse =
          await this.pomeloService.createPomeloAssociation(
            createPomeloAssociationDto,
          );
        if (
          !createPomeloAssociationResponse ||
          createPomeloAssociationResponse.error
        ) {
          console.log(
            'createPomeloAssociationResponse error:',
            createPomeloAssociationResponse,
          );
          console.error(
            'createPomeloAssociationResponse error details:',
            createPomeloAssociationResponse?.error?.details,
          );
          throw new Error(
            'Error creating Pomelo association: ' +
              (createPomeloAssociationResponse?.error?.details?.[0]?.detail ||
                'Unknown error'),
          );
        }

      } catch (error) {
        console.error('Error creating Pomelo association:', error);
      }

      const transactionInitial: CreateTransactionDto = {
        account_id: creditAssignmentResponsePomelo.data.id,
        type: 'CASHIN',
        process_type: 'ORIGINAL',
        data: {
          tx_properties: {
            network_name: 'dey Fondeo',
          },
          description: {
            // "es-AR": "Alguna descripción.",
            'en-US': 'dey - Aprobación línea de crédito',
          },
          details: [
            {
              amount: (Number(userSalary.user.salary) * 0.3)
                .toFixed(2)
                .toString(),
              entry_type: 'DEBIT',
              type: 'BASE',
              subtype: 'SALARY_ADVANCE',
              description: {
                // "es-AR": "Detalle en español.",
                'en-US': '30% of salary advance',
              },
              // metadata: JSON.stringify({ extra_property_1: "My value" })
            },
          ],
          // metadata: JSON.stringify({ extra_property_1: "My value" })
        },
        entry_type: 'CREDIT',
        total_amount: (Number(userSalary.user.salary) * 0.3)
          .toFixed(2)
          .toString(),
        // process_before: "2025-10-08T20:59:27.791Z",
        // accounts_id: ["string"],
        // client_id: "string",
        // local: {
        //   total: "string",
        //   currency: "string"
        // },
        // settlement: {
        //   total: "string",
        //   currency: "string"
        // },
        // transaction: {
        //   total: "string",
        //   currency: "string"
        // }
      };
      try {

        const transactionInitialResponse =
          await this.pomeloService.createPomeloTransaction(transactionInitial);

      } catch (error) {
        console.error('Error creating initial transaction in Pomelo:', error);
      }
    } catch (error) {
      console.error('Error during Pomelo card or credit creation:', error);
    }

    await this.pomeloService.generateReference('12', {
      id: userId,
      type: 'spei',
      amount: '000000',
    });

    // }
    try {
      if (
        userResponse &&
        createPomeloCardResponse &&
        creditAssignmentResponsePomelo
      )
        await this.userVerifiedService.saveUserPomeloInfo({
          id: userId,
          pomelo_user_id: userResponse.data.id,
          virtual_card_id: createPomeloCardResponse.data.id,
          sod_id: creditAssignmentResponsePomelo.data.id,
        });
    } catch (error) {
      console.error('Error saving user Pomelo info:', error);
    }

    return true;
  }

  private async isCustomerCreated(external_id: string): Promise<boolean> {
    // return !!(await this.customerInformationUsecasesProxy
    //   .getInstance()
    //   .findByUserId(external_id));
    const customer = await this.prisma.customer_information.findFirst({
      where: { account_external_id: external_id },
    });
    return !!customer;
  }

  async sendJsonToSw(payload: any) {
    try {
      const startPasthMonth = new Date();
      startPasthMonth.setMonth(startPasthMonth.getMonth() - 1);
      startPasthMonth.setDate(1);
      const inicio = startPasthMonth.toISOString().split('T')[0];
      const endPasthMonth = new Date();
      endPasthMonth.setMonth(endPasthMonth.getMonth() - 1);
      endPasthMonth.setDate(
        new Date(
          endPasthMonth.getFullYear(),
          endPasthMonth.getMonth() + 1,
          0,
        ).getDate(),
      );
      const fin = endPasthMonth.toISOString().split('T')[0];
      console.log('Payload to send:', payload);

      // Get the first Friday of the current month
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const firstFriday = new Date(year, month, 1);
      while (firstFriday.getDay() !== 5) {
        firstFriday.setDate(firstFriday.getDate() + 1);
      }
      const fechaCorte = firstFriday.toISOString().split('T')[0];
      const fechaLimitePagoDate = new Date(firstFriday);
      fechaLimitePagoDate.setDate(fechaLimitePagoDate.getDate() + 1);
      const fechaLimitePago = fechaLimitePagoDate.toISOString().split('T')[0];

      const userInfo = await this.userVerifiedService.findUserByEmail(
        payload.email,
      );
      console.log('User info retrieved:', userInfo);

      const useUser = await this.prisma.user.findFirst({
        where: { email: payload.email },
      });

      if (!useUser) {
        throw new Error('User not found');
      }

      const stpAccount = await this.prisma.stp_clabe.findFirst({
        where: { user_id: useUser.id },
      });
      console.log('STP Account retrieved:', stpAccount);
      const contractInfo = await this.prisma.signing_result.findFirst({
        where: { email: payload.email, event_type: 'doc_signed' },
        orderBy: { date_created: 'desc' },
      });
      console.log('Contract info retrieved:', contractInfo);

      const jsonInfo = JSON.parse(contractInfo?.object || '{}');

      const result = await this.pomeloService.getCustomerInformation(
        payload.email,
      );
      console.log('Customer information retrieved:', result);

      const movimientos: any = [];
      let totalCompras = 0.0;
      let totalPagos = 0.0;
      const imputaciones = await this.pomeloService.getActivities(
        String(useUser.sod_id),
      );
      // console.log('Imputaciones retrieved:', imputaciones);
      let actualSaldo = Number(result.userInfo.available);
      let totalTransacciones = 0;
      let totalTransaccionesCommission = 0.0;
      let totalTransaccionesIva = 0.0;
      let totalMktp = 0.0;
      let totalMktpCommission = 0.0;
      const totalMktpIva = 0.0;
      console.log('User available balance:', userInfo);

      imputaciones?.data?.forEach((element, index) => {
        // console.log('Imputacion element:', element);
        console.log('Imputacion element:', element.data);
        if (element.type !== 'CASHIN') {
          if (element.data.description !== 'Transferencia') {
            totalMktp += Number(element.total_amount) - 15;
            totalMktpCommission += 15;
          } else {
            totalTransaccionesCommission += Number(element.total_amount) * 0.11;
            totalTransaccionesIva +=
              Number(totalTransaccionesCommission) * 0.16;
            totalTransacciones +=
              Number(element.total_amount) -
              (Number(totalTransaccionesCommission) +
                Number(totalTransaccionesIva));
          }
          totalCompras += Number(element.total_amount);
        } else {
          if (
            element.data.description !== 'dey - Aprobación línea de crédito'
          ) {
            totalPagos += Number(element.total_amount);
          }
        }
        console.log('Actual saldo before operation:', actualSaldo);
        console.log('totalCompras so far:', totalCompras);
        const currentSaldo =
          movimientos.length > 0
            ? movimientos[movimientos.length - 1].saldo
            : 0.0;
        const newSaldo =
          element.account_txs.entry_type === 'DEBIT'
            ? currentSaldo - Number(element.total_amount)
            : currentSaldo + Number(element.total_amount);
        movimientos.push({
          fecha: element.created_at.split('T')[0],
          concepto: element.data.description || 'N/A',
          cargo: element.type !== 'CASHIN' ? Number(element.total_amount) : 0.0,
          abono: element.type === 'CASHIN' ? Number(element.total_amount) : 0.0,
          saldo: actualSaldo,
        });
        if (index !== imputaciones.data.length - 1) {
          actualSaldo += Number(element.total_amount);
        }
      });
      // Calculate the number of days in the period (inclusive)
      const diasPeriodo = (() => {
        const start = new Date(inicio);
        const end = new Date(fin);
        // Difference in milliseconds, then convert to days and add 1 for inclusivity
        return (
          Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1
        );
      })();

      // Helper function to format numbers as MXN currency
      const formatMXN = (value: number) =>
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(value);

      const datos = {
        cliente: {
          nombre: `${userInfo.names} ${userInfo.fathers_lastname} ${userInfo.mothers_lastname}`,
          direccion:
            userInfo.legal_street_name +
            ' ' +
            userInfo.legal_street_number +
            ', ' +
            (userInfo.legal_apartment
              ? 'Apt ' + userInfo.legal_apartment + ', '
              : ''),
          colony: userInfo.legal_neighborhood,
          munucipality:
            userInfo.legal_zip_code +
            ', ' +
            userInfo.legal_city +
            ', ' +
            userInfo.legal_region,
          numeroCliente: userInfo.id.toString().padStart(6, '0'),
          rfc: userInfo.rfc,
          cuentaClabe: stpAccount?.clabe || '000000000000000000',
          numeroContrato: jsonInfo?.open_id || 'N/A',
          limiteCredito: formatMXN(Number(useUser?.salary) * 0.3),
          limiteCreditoGraph: Number(useUser?.salary) * 0.3,
        },
        periodo: {
          inicio: inicio,
          fin: fin,
          fechaCorte: fechaCorte,
          fechaLimitePago: fechaLimitePago,
        },
        movimientos: movimientos.map((mov: any) => ({
          ...mov,
          cargo: formatMXN(mov.cargo),
          abono: formatMXN(mov.abono),
          saldo: formatMXN(mov.saldo),
        })),
        resumen: {
          totalCompras: formatMXN(totalCompras),
          totalPagos: formatMXN(totalPagos),
        },
        infoTable: {
          normalPayment: formatMXN(result.userInfo.normalPayment),
          saldoInicial: formatMXN(actualSaldo),
          saldoInsoluto: formatMXN(totalCompras),
          abonos: formatMXN(totalPagos),
          cargos: formatMXN(totalCompras),
          saldoFinal: formatMXN(Number(result.userInfo.available)),
          pagosAnticipados: formatMXN(0.0),
          folio: useUser.pomelo_user_id || 'N/A',
          iep: formatMXN(0.0),
          pagoMinimo: formatMXN(result?.userInfo.minimumPayment || 0.0),
          diasPeriodo: diasPeriodo,
          capital: formatMXN(totalTransacciones + totalMktp),
          intereses: formatMXN(0.0),
          iva: formatMXN(totalTransaccionesIva),
          seguro: formatMXN(0.0),
          comisiones: formatMXN(
            totalTransaccionesCommission + totalMktpCommission,
          ),
          totalPagado: formatMXN(0.0),
          iceep: formatMXN(0.0),
          comisionesCuenta: formatMXN(0.0),
          pagoTardio: formatMXN(0.0),
          cpai: formatMXN(0.0),
          totalComisiones: formatMXN(0.0),
          cargosObjetados: formatMXN(0.0),
          saldoInicialGraph: actualSaldo,
          saldoInsolutoGraph: totalCompras,
          saldoFinalGraph: Number(result.userInfo.available),
          cargosObjetadosGraph: 0.0,
          pagosAnticipadosGraph: 0.0,
        },
      };
console.log('step 1 generating pdf');
const pdfBuffer = await this.generarPdf(datos);

console.log('step 2 uploading pdf to S3');

const s3Bucket =
  this.configService.get<string>('AWS_S3_BUCKET') || 'dey-flujos-v2';

const s3Key = `pdf/estado_de_cuenta_${useUser.pomelo_user_id}_${Date.now()}.pdf`;

const command = new PutObjectCommand({
  Bucket: s3Bucket,
  Key: s3Key,
  Body: pdfBuffer,
  ContentType: 'application/pdf',
});

await this.s3.send(command);

const s3Url = `https://${s3Bucket}.s3.us-east-1.amazonaws.com/${s3Key}`;

console.log('PDF uploaded to S3:', s3Url);

await this.prisma.account_states.create({
  data: {
    email: payload.email,
    name: 'Estado de cuenta Noviembre 2025',
    link: s3Url,
  },
});

console.log('step 3 sending mail with pdf attachment');

await this.notificationsService.sendMailWithAttachment(
  'gabriel.t@dey.mx',
  `${userInfo.names} ${userInfo.fathers_lastname} ${userInfo.mothers_lastname}`,
  pdfBuffer,
);

console.log('Email sent successfully with PDF attachment.');

    } catch (error) {
      console.error('Error sending JSON to SW Sapien:', error);
      throw error;
    }
  }

  async generarPdf(datos: any): Promise<Buffer> {
    console.log('Generating PDF step 1');
    const templateUrl =
      'https://dey-flujos-v2.s3.us-east-2.amazonaws.com/estado_de_cuenta.ejs';
    const template = await axios.get(templateUrl).then((res: any) => res.data);

    console.log('Generating PDF step 2');
    const html = ejs.render(template, datos);
    console.log('Generating PDF step 3');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Generating PDF step 4');
    const page = await browser.newPage();
    console.log('Generating PDF step 5');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('Generating PDF step 6');
    // Inject Google Fonts into the HTML before rendering PDF
    const fontLinks = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
      <style>
      body, * {
        font-family: 'Outfit', sans-serif !important;
      }
      </style>
    `;
    console.log('Generating PDF step 7');
    // const htmlWithFonts = html.replace('<head>', `<head>${fontLinks}`);
    // console.log('Generating PDF step 8');
    // // Aumentar el timeout a 60 segundos para evitar TimeoutError
    // await page.setContent(htmlWithFonts, { waitUntil: 'networkidle0', timeout: 60000 });
    console.log('Generating PDF step 9');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: '10px',
        bottom: '40px',
      },
      headerTemplate: `
        <div style="font-size:10px; text-align:right; width:100%; margin-right: 20px; font-family: 'Outfit', sans-serif;">
        Página <span class="pageNumber"></span> de <span class="totalPages"></span>
        </div>
      `,
      footerTemplate: `
      <div style="width: 100%; font-size: 8px; text-align: center; color: #555; font-family: 'Outfit', sans-serif;">
        <hr style="border: 0; border-top: 1px solid #ffb600; margin: 5px 0;">
        <div>CAPITAL AFFAIRS SAPI DE CV SOFOM ENR | Dirección: Bosque de Tejocotes 309, Colonia Bosques de las Lomas, Alcaldía Cuajimalpa de Morelos, CP 05120 CDMX | Línea dey CDMX 55 25 59 94 36</div>
      </div>
      `,
    });
    console.log('Generating PDF step 10');

    await browser.close();
    console.log('Generating PDF step 11');
    return Buffer.from(pdfBuffer);
  }

  // private async creatingCustomerInMO(
  //   user: VerifiedUser,
  //   userId: string,
  //   creditAssignmentResponse: CreditAssignmentResponse,
  //   cutoff_date: number,
  // ) {
  //   const product = await this.setProductId(creditAssignmentResponse);

  //   const temporayAddress = user.address.replace(/[.,]/g, ''); //TODO: se debe eliminar esta funcionalidad, ya que las direcciones deben tener puntos y comas

  //   const payment_day = creditAssignmentResponse.onDemand
  //     ? '15'
  //     : `${cutoff_date}`;

  //   const userMoNeededData: CreateCustomerDto = this.setMoUserData(
  //     product,
  //     userId,
  //     user,
  //     temporayAddress,
  //     payment_day,
  //     creditAssignmentResponse.amount
  //   );

  //   //Creating customer with userMoNeededData
  //   const customerResponse: CreateCustomerResponse =
  //     await this.moService.createCustomer(userMoNeededData);

  //   const maxRetries = 200;
  //   let retries = 0;

  //   //Creating a delay to await the account card information
  //   const delay = (ms: number) =>
  //     new Promise(resolve => setTimeout(resolve, ms));

  //   let customerData = await this.moService.getCustomerInformation(
  //     customerResponse.response_data.external_id,
  //   );

  //   // this while loop will execute the getCustomerInformation service until we get account card information
  //   // or unitl retries === maxRetries, the delay between every row is 5s
  //   while (!customerData.response_data.account_card && retries < maxRetries) {
  //     await delay(5000);
  //     customerData = await this.moService.getCustomerInformation(
  //       customerResponse.response_data.external_id,
  //     );
  //     retries++;
  //   }

  //   if (!customerData.response_data.account_card) {
  //     throw new Error('Account card not found after maximum retries.');
  //   }

  //   await this.saveCustomerInformation(customerData);
  // }

  // private setMoUserData(
  //   product: ProductData,
  //   userId: string,
  //   user: VerifiedUser,
  //   temporayAddress: string,
  //   payment_day: string,
  //   amount: number,
  // ): CreateCustomerDto {
  //   return {
  //     external_id: userId.toString(),
  //     line_of_credit: amount,
  //     product_id: product?.product_id,
  //     first_name: user.names,
  //     middle_name: '', //TODO: solo acepta alfanuméricos, no puede ir como string vacío.
  //     last_name: user.lastname,
  //     city: user.residenceState,
  //     address: temporayAddress,
  //     postal_code:
  //       +user.postalCode && +user.postalCode !== 0 ? +user.postalCode : 12345,
  //     payment_day,
  //     email: user.email,
  //     phone_number: user.phone,
  //     identification_number: user.curp,
  //     identification_type: 'CURP',
  //   };
  // }

  // private async setProductId(
  //   creditAssignmentResponse: CreditAssignmentResponse,
  // ): Promise<ProductData> {
  //   enum ProductName {
  //     SalaryOnDemand = 'Salary on Demand',
  //     CreditCard = 'Credit Card',
  //   }
  //   enum ProductType {
  //     installment = 'installment'
  //   }

  //   const products = await this.moService.getSegments(3000);

  //   const currentProduct = creditAssignmentResponse.onDemand
  //     ? ProductName.SalaryOnDemand
  //     : creditAssignmentResponse.microcredit
  //       ? ProductName.CreditCard
  //       : null;

  //   const revolving = products.response_data.find(
  //     product => product.credit_type === ProductType.installment,
  //   );

  //   const product = products.response_data.find(
  //     product => product.product_name === currentProduct,
  //   );

  //   return revolving;
  // }

  // private async saveCustomerInformation(
  //   customerData: GetCustomerInformationResponse,
  // ) {
  //   //At this point we create our customerInformation input
  //   const cardsAux = customerData?.response_data?.account_card?.cards?.map(
  //     card => {
  //       return {
  //         external_id: card.external_id,
  //         status: card.status,
  //       };
  //     },
  //   );

  //   const customerInformationAux: createCustomerInformationDto = {
  //     id: customerData?.response_data?.account_card?.external_id,
  //     account_external_id: customerData?.response_data?.external_id,
  //     cards: cardsAux,
  //   };

  //   // Saving a new customerInformation
  //   this.customerInformationUsecasesProxy
  //     .getInstance()
  //     .insert(customerInformationAux);
  // }
}

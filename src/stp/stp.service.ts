import { Injectable } from '@nestjs/common';
import { CreateStpDto } from './dto/create-stp.dto';
import { UpdateStpDto } from './dto/update-stp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferDto } from './dto/stp.dto';
import { OrdenPago, expectedOrderRegisterOrder } from 'src/model/StpSignedModel';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';



@Injectable()
export class StpService {


  // private readonly stpBase = process.env.STP_BASE;
  // private readonly stpPlaza = process.env.STP_PLAZA;
  // private readonly stpClientPrefix = process.env.STP_CLIENT_PREFIX;
  private readonly stpBase: number;
  private readonly stpPlaza: number;
  private readonly stpClientPrefix: string;

private s3: S3Client;
private cachedPrivateKey: string | null = null;

constructor(
  private readonly prisma: PrismaService,
  private readonly transService: TransactionsService,
  private readonly httpService: HttpService,
  private readonly configService: ConfigService,
) {
  this.stpBase = Number(this.configService.get<string>('STP_BASE'));
  this.stpPlaza = Number(this.configService.get<string>('STP_PLAZA'));
  this.stpClientPrefix =
    this.configService.get<string>('STP_CLIENT_PREFIX') || '2866';

  this.s3 = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey:
        this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
    },
  });
}

  async sendOrdenPagoRequest(order: TransferDto, commissionTransfer: string, commissionUse: string, iva: string): Promise<any> {
    try {
      // const responseCommission =
      //   await this.transService.checkBalanceAndCommission({
      //     userId: order.id,
      //     amount: +order.monto,
      //     operationId: +(process.env.COMMISSION_STP ?? 0),
      //     operationType: +(process.env.COMMISSION_STP ?? 0),
      //   });

      const responseCommission = {
        initialAmount: +order.monto,
        transactionCommissionId: 1,
      }
      order.monto = `${responseCommission.initialAmount}`;

      const ordenPagoWs = this.generateOrder(order);

      const cadena = await this.generateOriginalString(
        ordenPagoWs,
        expectedOrderRegisterOrder,
      );

      const {
        cuentaBeneficiario,
        tipoCuentaOrdenante,
        nombreBeneficiario,
        // rfcCurpBeneficiario,
        conceptoPago,
        institucionOperante,
        referenciaNumerica,
        claveRastreo,
        monto,
        tipoCuentaBeneficiario,
        institucionContraparte,
        tipoPago,
        cuentaOrdenante,
        rfcCurpOrdenante,
        empresa,
      } = ordenPagoWs;

      const payload = {
        cuentaBeneficiario: cuentaBeneficiario,
        tipoCuentaOrdenante: tipoCuentaOrdenante,
        nombreBeneficiario: nombreBeneficiario,
        rfcCurpBeneficiario: 'ND',
        conceptoPago: conceptoPago,
        institucionOperante: institucionOperante,
        referenciaNumerica: referenciaNumerica,
        claveRastreo: claveRastreo,
        monto: this.formatAmount(monto),
        tipoCuentaBeneficiario: tipoCuentaBeneficiario,
        // institucionContraparte: institucionContraparte,
        institucionContraparte: String(90646),
        tipoPago: tipoPago,
        cuentaOrdenante: cuentaOrdenante,
        rfcCurpOrdenante: rfcCurpOrdenante,
        empresa: empresa,
        firma: await this.getSign(cadena),
        latitud: order.latitud,
        longitud: order.longitud,
      };


      const idAccount = await this.prisma.account.findFirst({
        where: {
          user_id: order.id,
          // account_number: String(cuentaOrdenante),
        },
      });

      if (!idAccount) {
        throw new Error(`No account found for user_id: ${order.id} and account_number: ${cuentaOrdenante}`);
      }

      // console.log('Payload to STP:', payload);
      // Usar una instancia de https.Agent para httpsAgent
      const https = await import('https');
      const agent = new https.Agent({ rejectUnauthorized: false });
      const response = await this.fetchDataFromExternalService(
        // `${process.env.STP_REGISTRO_URL}`,
        `https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra`,
        payload,
        'put',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          httpsAgent: agent,
        },
      );
      // console.log('Response from STP:', response.data);
      if (response.data.resultado.descripcionError) {
        // throw new BadRequestException(
        //   `${response.data.resultado.descripcionError} idError:${response.data.resultado.id}`,
        // );
        throw new Error(
          `${response.data.resultado.descripcionError} idError:${response.data.resultado.id}`,
        );
      }
      console.log('Response from STP:', response.data);
      console.log('Generating transaction record...');
      console.log(order)
      await this.generateTransaction(
        ordenPagoWs,
        response.data.resultado.id,
        Number(idAccount.id),
        order.id,
        responseCommission.transactionCommissionId,
        claveRastreo,
      commissionTransfer,
      commissionUse,
      iva,
      );
      response.data['referenciaNumerica'] = referenciaNumerica;
      response.data['referenciaNumericaStp'] = response.data.resultado.id;

      return response.data;
    } catch (error) {
      // throw new BadRequestException(
      //   `Error sending OrdenPago request: ${error}`,
      // );
      console.error('Error sending OrdenPago request:', error);
      throw new Error(`Error sending OrdenPago request: ${error}`);
    }
  }

  create(createStpDto: CreateStpDto) {
    return 'This action adds a new stp';
  }

  findAll() {
    return `This action returns all stp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stp`;
  }

  update(id: number, updateStpDto: UpdateStpDto) {
    return `This action updates a #${id} stp`;
  }

  remove(id: number) {
    return `This action removes a #${id} stp`;
  }

  async generateTransaction(
    ordenPagoWs: any,
    transId: number,
    accountId: number,
    userId: number,
    commissionId: number,
    claveRastreo?: string,
    commissionTransfer?: string,
    commissionUse?: string,
    iva?: string,

  ) {
    const trans: Transaction = {
      account_id: accountId,
      transaction_id: `${transId}`,
      transaction_commission_id: commissionId,
      amount: ordenPagoWs.monto,
      status: 2,
      entity: 69,
  // provider_id: process.env.PROVIDER_STP,
  provider_id: this.configService.get('PROVIDER_STP'),
      reference: null,
      details: `${ordenPagoWs.conceptoPago}`,
      user_id: userId,
      claveRastreo,
      commissionUse,
      iva,
    };
    const commission = commissionTransfer

    return await this.transService.createTransactionRecord({...trans, commission});
  }


  generateOrder(data: TransferDto): OrdenPago {
    const {
      cuentaBeneficiario,
      nombreBeneficiario,
      conceptoPago,
      tipoCuentaBeneficiario,
      institucionContraparte,
      monto,
    } = data;

    const paymentData: OrdenPago = {
      cuentaBeneficiario: cuentaBeneficiario,
      tipoCuentaOrdenante: '40',
      nombreBeneficiario: nombreBeneficiario,
      rfcCurpBeneficiario: 'ND',
      conceptoPago: conceptoPago,
  // institucionOperante: String(process.env.STP_OPERANTE),
  institucionOperante: this.configService.get('STP_OPERANTE') || '90646',
      referenciaNumerica: `${this.generateRandomNumber7()}`,
      claveRastreo: `Dey${this.generateRandomNumber()}`,
      tipoCuentaBeneficiario: tipoCuentaBeneficiario,
  // cuentaOrdenante: String(process.env.STP_CUENTA),
  cuentaOrdenante: this.configService.get('STP_CUENTA') || '646180286600000003',
  // empresa: String(process.env.STP_EMPRESA),
  empresa: this.configService.get('STP_EMPRESA') || 'CAPITAL_AFFAIRS',
      folioOrigen: '',
      // institucionContraparte: institucionContraparte,
      institucionContraparte: String(90646),
      monto: this.formatAmount(monto),
      rfcCurpOrdenante: 'ND',
      tipoPago: '1',
      fechaOperacion: '',
      nombreOrdenante: '',
      emailBeneficiario: '',
      tipoCuentaBeneficiario2: '',
      nombreBeneficiario2: '',
      cuentaBeneficiario2: '',
      rfcCurpBeneficiario2: '',
      conceptoPago2: '',
      claveCatalogoUsuario1: '',
      claveCatalogoUsuario2: '',
      clavePago: '',
      referenciaCobranza: '',
      tipoOperacion: '',
      topologia: '',
      usuario: '',
      medioEntrega: '',
      prioridad: '',
      iva: '',
    };

    return paymentData;
  }

  generateRandomNumber() {
    const min = 1000000000000; // 10^12
    const max = 9999999999999; // 10^13 - 1

    // Generar un número aleatorio entre min y max, ambos incluidos
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString();
  }

  generateRandomNumber7() {
    const min = 1000000; // 10^12
    const max = 9999999; // 10^13 - 1

    // Generar un número aleatorio entre min y max, ambos incluidos
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString();
  }

  formatAmount(amount: string): string {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      throw new Error('El monto proporcionado no es válido.');
    }
    return parsedAmount.toFixed(2);
  }

  async generateOriginalString(
    data: Record<string, any>,
    expectedOrder: string[],
  ): Promise<string> {
    try {
      const cadenaOriginalArray: string[] = ['||'];

      expectedOrder.forEach((key, index) => {
        const value = data[key];

        if (value === undefined) {
          throw new Error(
            `La propiedad '${key}' es requerida pero no está presente en la data.`,
          );
        }

        const formattedValue = typeof value === 'string' ? value.trim() : value;

        cadenaOriginalArray.push(
          `${formattedValue}${index < expectedOrder.length - 1 ? '|' : ''}`,
        );
      });

      cadenaOriginalArray.push('||');
      return cadenaOriginalArray.join('');
    } catch (err) {
      throw new Error(`Error generating original string: ${err.message}`);
    }
  }

  async fetchDataFromExternalService(
    urlServices: string,
    payload: Record<string, any>,
    method: 'post' | 'put',
    options: Record<string, any> = {},
  ): Promise<AxiosResponse> {
    try {
      // console.log('Payload to external service:', payload);
      // console.log('URL to external service:', urlServices);
      // console.log('Method to external service:', method);
      // console.log('Options to external service:', options);
      return await lastValueFrom(
        this.httpService[method]<unknown>(urlServices, payload, options).pipe(
          catchError(error => {
            return throwError(() => error);
          }),
        ),
      );
    } catch (error) {
      console.error('Error in HTTP request:', error);
      if (error.response) {
        const responseError = error.response;

        return responseError;
      } else {
        throw new Error('Error en la solicitud HTTP');
      }
    }
  }

  private async getPrivateKey(): Promise<string> {
  if (this.cachedPrivateKey) {
    return this.cachedPrivateKey;
  }

  const bucket =
    this.configService.get<string>('BUCKET_STP_CERTIFICATES')!;
  const key =
    this.configService.get<string>('BUCKET_STP_CERTIFICATES_NAME')!;

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await this.s3.send(command);

    if (!response.Body) {
      throw new Error('El archivo PEM está vacío');
    }

    this.cachedPrivateKey = await response.Body.transformToString();

    return this.cachedPrivateKey;
  } catch (err: any) {
    throw new Error(
      `No se pudo obtener la llave privada desde S3: ${err.message}`,
    );
  }
}

async getSign(cadenaOriginal: string): Promise<string> {
  try {
    const privateKey = await this.getPrivateKey();

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(cadenaOriginal);
    sign.end();

    return sign.sign(privateKey, 'base64');
  } catch (error: any) {
    throw new Error(`Error generating signature: ${error.message}`);
  }
}


  async getCLABE(userId: number) {

    // const currentClabe = await this.stpClabeUsecasesProxy.getInstance().getByUserId(userId);
    const currentClabe = await this.prisma.stp_clabe.findFirst({
      where: {
        user_id: userId
      }
    })

    if (currentClabe)
      return currentClabe.clabe;

    const clabe = this.generateCLABE(userId);

    // Obtener el último id de stp_clabe
    const lastEntry = await this.prisma.stp_clabe.findFirst({
      orderBy: { id: 'desc' },
    });
    const nextId = lastEntry ? lastEntry.id + 1 : 1;

    await this.prisma.stp_clabe.create({
      data: {
        id: nextId,
        clabe,
        user_id: userId
      }
    })

    return clabe;

  }

  private generateCLABE(userId: number): string {

    const clabeSinDigito = String(this.stpBase) + String(this.stpPlaza) + this.stpClientPrefix + userId.toString().padStart(7, '0');
    const controlDigit = this.calculateControlDigit(clabeSinDigito);

    return clabeSinDigito + controlDigit;
  }

  private calculateControlDigit(clabe: string): number {
    const weights = [3, 7, 1];
    let sum = 0;

    for (let i = 0; i < clabe.length; i++) {
      const digit = parseInt(clabe[i], 10);
      sum += (digit * weights[i % 3]) % 10;
    }

    return (10 - (sum % 10)) % 10;
  }
}

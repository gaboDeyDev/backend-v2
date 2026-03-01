import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { WebhookStpService } from './webhook-stp.service';
import { CreateWebhookStpDto } from './dto/create-webhook-stp.dto';
import { UpdateWebhookStpDto } from './dto/update-webhook-stp.dto';
import { SendAbonoDto, TransactionDto } from './dto/stpWebhook';
import { Abone } from 'src/model/AboneModel';
import { PrismaService } from 'src/prisma/prisma.service';
import { tr } from 'date-fns/locale';
import path from 'path';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { CreateTransactionDto } from 'src/pomelo/dto/create-transaction';
import { ConfigService } from '@nestjs/config';

const transactionStates = {
  liquidado: 'LQ',
  cancelado: 'CN',
  devuelto: 'D',
};

@Controller('webhook-stp')
export class WebhookStpController {
  constructor(
    private readonly webhookStpService: WebhookStpService,
    private readonly prismaService: PrismaService,
    private readonly pomeloService: PomeloService,
  ) { }

  @Post('transaction')
  @HttpCode(200)
  async changeStateDispersion(@Body() data: TransactionDto) {
    console.log('data stpwebhook/transaction', data);
    try {
      console.log('webhook data transaction', `${data.id}`);

      // const trans = await this.transactionsService.getTransactionByTransIdStp(
      //   data.id.toString(),
      // );
      const trans = await this.prismaService.transactions_detail.findFirst({
        where: {
          stp_transaction_id: data.id.toString()
        },
        include: {
          transaction: true
        }
      });

      if (!trans) {
        throw new Error('Transaction not found');
      }

      // const trasnUpdated = await this.changeState(
      //   trans,
      //   data.estado,
      // );

      let updateData: any = {};
      const upperCaseState = data.estado.toUpperCase();
      switch (upperCaseState) {
        case transactionStates.liquidado:
          updateData.status = 1;
          break;
        case transactionStates.cancelado:
        case transactionStates.devuelto:
          updateData.balance = `${this.calculateDebt(+trans.transaction.balance, +trans.transaction.amount)}`;
          updateData.debt = `${this.calculateBalance(+trans.transaction.debt, +trans.transaction.amount)}`;
          updateData.status = upperCaseState === transactionStates.cancelado ? 5 : 4;
          break;
        default:
          break;
      }

      const trasnUpdated = data;

      const res = await this.prismaService.transaction.update({
        where: { id: trans.transaction.id },
        data: updateData
      });

      if (data.estado === 'D') {
        const transactionDate = new Date(trans.date_created);
        // const finalDate = addMonthToDate(transactionDate);

        // const customerInformation = await this.moService.getCustomerInformation(
        //   String(trans.user_id),
        // );

        // const moTransactions = await this.moService.getMovements({
        //   accountCardExternalId:
        //     customerInformation.response_data.account_card.external_id,
        //   createdAtGte: formatDate(transactionDate),
        //   createdAtLte: formatDate(finalDate),
        // });

        // const transactionToReturn = moTransactions.results.find(
        //   MoTransaction => {
        //     return MoTransaction.others.transactionId === trans.id;
        //   },
        // );

        // // TODO: considerar tarjeta fisica
        // if (transactionToReturn) {
        //   await this.moService.createAdvance({
        //     external_id: transactionToReturn.external_id,
        //     amount: Math.abs(+transactionToReturn.amount),
        //     account_card_external_id:
        //       customerInformation.response_data.account_card.external_id,
        //     card_external_id:
        //       customerInformation.response_data.account_card.cards[0]
        //         .external_id,
        //     others: {
        //       transactionId: trans.id,
        //     },
        //   });
        // }
      }

      if (data.estado === 'LQ') {
        const verifyUser = await this.prismaService.verified_user.findUnique({
          where: { id: trans.transaction.user_id }
        });

        const user = await this.prismaService.user.findUnique({
          where: { email: verifyUser?.email }
        });



        const amount = +trans.transaction.amount + +Number(trans.transaction.commission_value) + +trans.transaction.iva_value + +Number(trans.transaction.commission_use || 0);
        const amountPomelo = +trans.transaction.amount
        // Resta 6 horas a la fecha actual para operation_date
        const operationDate = new Date();
        operationDate.setHours(operationDate.getHours() - 6);

        /*
        this.pomeloService.informarOperacionPomelo({
          credit_line_id: user?.sod_id || '',
          external_id: String(trans.stp_transaction_id),
          type: 'CHARGE',
          amount: String(amount),
          currency: 'MXN',
          operation_date: operationDate.toISOString().replace(/:\d{3}Z$/, 'Z'), // ISO-8601 with Z (UTC)
          description: trans.transaction.details || '',
        })*/
        const transactionInitial: CreateTransactionDto = {
          account_id: user?.sod_id || '',
          type: "CASHOUT",
          process_type: "ORIGINAL",
          data: {
            tx_properties: {
              network_name: "Dey",
            },
            description: {
              "en-US": "Transferencia"
            },
            details: [
              {
                amount: (amountPomelo).toFixed(2).toString(),
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
          total_amount: (amountPomelo).toFixed(2).toString(),
        };
        try {
          const transactionInitialResponse = await this.pomeloService.createPomeloTransaction(transactionInitial);
        } catch (error) {
          console.error('Error creating initial transaction in Pomelo:', error);
        }





        // await this.moService.createConfirmSettlement({
        //   userId: String(trans.user_id),
        //   amount: transactionAmount,
        //   transaction: trans,
        //   provider: "STP"
        // });
      }

      const logDtoObject = {
        request: JSON.stringify(res),
        type_log: 'transaction-webhook',
      };

      await this.prismaService.logs.create({
        data: {
          request: JSON.stringify(res),
          request_type: 'transaction-webhook',
          ip: '', // Provide actual IP if available
          path: '/webhook-stp/transaction', // Adjust path as needed
          user: '', // Provide actual user if available
          status: 200, // Or use appropriate status
          response: JSON.stringify(res), // Or use appropriate response
        }
      });
      // await this.logUsecasesProxy.getInstance().insert(logDtoObject);

      console.log('Transacción actualizada', `${updateData.status}`);

      return { mensaje: 'recibido' };
    } catch (err) {
      console.error('Error in webhook transaction:', err);
      const logDtoObject = {
        body_request: JSON.stringify(err),
        type_log: 'transaction-webhook-error',
      };
      // this.logUsecasesProxy.getInstance().insert(logDtoObject);

      // this.handle.handleError('Error in evaVerification', err);
      throw new Error('Error in webhook transaction');
    }
  }

  @Post('send-abono')
  @HttpCode(200)
  async sendAbono(@Body() data: SendAbonoDto) {
    try {
      const payload: Abone = {
        id: `${data?.id}`,
        dateOperation: `${data?.fechaOperacion}`,
        entity: `${data?.institucionBeneficiaria}`,
        rfcCurp: `${data?.rfcCurpBeneficiario}`,
        amount: `${data?.monto}`,
        detail: `${data?.conceptoPago}`,
        reference: `${data?.referenciaNumerica}`,
      };

      // const res = await this.fetchHttpService.fetchDataFromExternalService(
      //   `${process.env.TRANS_URL}/transaction/abone`,
      //   payload,
      //   'post',
      // );

      // const aboneResponse = res.data.data;

      // await this.moService.createExternalPayment({
      //   external_id: aboneResponse.getTransactionCreated.id,
      //   customer_external_id: aboneResponse.getTransactionCreated.user_id,
      //   amount: data?.monto,
      //   provider: 'DEY',
      // });

      const logDtoObject = {
        body_request: JSON.stringify(data),
        type_log: 'send-abono-webhook',
      };

      // this.logUsecasesProxy.getInstance().insert(logDtoObject);
      await this.prismaService.logs.create({
        data: {
          request: JSON.stringify(data),
          request_type: 'send-abono-webhook',
          ip: '', // Provide actual IP if available
          path: '/webhook-stp/send-abono', // Adjust path as needed
          user: '', // Provide actual user if available
          status: 200, // Or use appropriate status
          response: JSON.stringify(data), // Or use appropriate response
        }
      });

      // console.log('transaccion realizada', `${res.data}`);

      // if (
      //   +aboneResponse.getTransactionCreated.debt === 0
      //   // &&
      //   // new Date(aboneResponse.transactionCycle.end_date) < new Date()
      // ) {
      //   this.fetchHttpService.fetchDataFromExternalService(
      //     `${process.env.TRANS_URL}/assign-amount`,
      //     { id: aboneResponse.getTransactionCreated.user_id },
      //     'post',
      //   );
      // }

      //TODO: validar respuesta y devolver 'devolver' o 'confirmar'
      return { mensaje: 'confirmar' };
    } catch (err) {
      // if (typeof err?.response?.response?.catalogCode === 'number') {
      //   const validation = await this.returnCataloguecasesProxy
      //     .getInstance()
      //     .getCaseByCatalogueCode(err.response.response.catalogCode);

      //   if (validation) {
      //     return {
      //       mensaje: 'devolver',
      //       id: validation.catalogue_code,
      //     };
      //   }
      // }

      // const logDtoObject = {
      //   body_request: JSON.stringify(err),
      //   type_log: 'send-abono-webhook-error',
      // };
      // this.logUsecasesProxy.getInstance().insert(logDtoObject);
      // this.handle.handleError('Error in send abone', err);
      throw new Error('Error in webhook send abone');
    }
  }

  @Post()
  create(@Body() createWebhookStpDto: CreateWebhookStpDto) {
    return this.webhookStpService.create(createWebhookStpDto);
  }

  @Get()
  findAll() {
    return this.webhookStpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webhookStpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebhookStpDto: UpdateWebhookStpDto) {
    return this.webhookStpService.update(+id, updateWebhookStpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webhookStpService.remove(+id);
  }

  calculateDebt(debt: number, amount: number) {
    const result = debt + amount;
    const roundedResult = parseFloat(result.toFixed(2));
    return roundedResult;
  }

  calculateBalance(balance: number, amount: number) {
    const result = balance - amount;
    const roundedResult = parseFloat(result.toFixed(2));
    return roundedResult;
  }

  @Post('simulate-undostres-payment')
  async simulateUndostresPayment(@Body() body: { skuid: number, reference: string, amount: number, userID: number, email: string }) {
    try {

      const userInfo = await this.prismaService.user.findUnique({
        where: { email: body.email }
      });
      const transactionInitial: CreateTransactionDto = {
        account_id: userInfo?.sod_id || '',
        type: "CASHOUT",
        process_type: "ORIGINAL",
        data: {
          tx_properties: {
            network_name: "dey",
          },
          description: {
            "en-US": `Compra en ${body.reference}`
          },
          details: [
            {
              amount: (body.amount).toFixed(2).toString(),
              entry_type: "DEBIT",
              type: "BASE",
              subtype: "TRANSFER",
              description: {
                "en-US": "pago de servicio"
              },
            }
          ],
        },
        entry_type: "DEBIT",
        total_amount: (body.amount).toFixed(2).toString(),
      };

      await this.pomeloService.createPomeloTransaction(transactionInitial);

      return { success: true, message: 'Pago simulado exitosamente' };
    } catch (error) {
      return { success: false, message: 'Error al simular el pago', error: error.message };
    }
  }
}

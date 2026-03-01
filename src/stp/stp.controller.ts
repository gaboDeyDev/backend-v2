import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { StpService } from './stp.service';
import { CreateStpDto } from './dto/create-stp.dto';
import { UpdateStpDto } from './dto/update-stp.dto';
import { TransferDto } from './dto/stp.dto';
import type { Response } from 'express';
import { TransactionStatusReturn } from './dto/transactionStatusModel';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('stp')
export class StpController {
  constructor(
    private readonly stpService: StpService,
    private readonly prisma: PrismaService,
  ) { }

  @Post('registerOrderPayment')
  async registraOrdenPago(
    @Res() response: Response,  
    @Body() body: any,
    // @Body() body: TransferDto
  ) {
    try {
      const verifiedUser = await this.prisma.verified_user.findFirst({
        where: { email: body.email },
      });
      const accountInfo = await this.prisma.account.findFirst({
        where: { user_id: verifiedUser ? verifiedUser.id : 0 },
      });
      
      console.log('Account Info:', accountInfo);
      const userId = verifiedUser ? verifiedUser.id : 0;
      
      if (userId === 0) {
        throw new Error('User not found');
      }
      const ordenPagoWs: TransferDto = {
        id: userId,
        nombreBeneficiario: accountInfo?.account_number || '',
        rfcCurpBeneficiario: accountInfo?.document_number || '',
        cuentaBeneficiario: accountInfo?.account_number || '',
        tipoCuentaBeneficiario: String(accountInfo?.account_type_id) || '',
        monto: body.monto,
        conceptoPago: body.conceptoPago,
        // institucionContraparte: accountInfo?.bank_code || '',
        institucionContraparte: '90646', // Hardcoded for testing
        latitud: body.latitud,
        longitud: body.longitud,
      };
      const responseOb = await this.stpService.sendOrdenPagoRequest(ordenPagoWs, body.commissionTransfer, body.commissionUse, body.iva);
      console.log('Payment order registered successfully:', responseOb);
      return response.status(200).json(responseOb);
    } catch (error) {
      console.error('Error registering payment order:', error);
      throw new Error('Error registering payment order');
    }
  }

  @Post('getTransactionStatus')
  async getTransactionStatus(
    @Res() response: Response,
    @Body() stpTransId: { stpTransactionId: string },
    // ): Promise<TransactionStatusReturn> {
  ): Promise<any> {
    try {
      // const transaction = await this.transactionUsecasesProxy
      //   .getInstance()
      //   .finByTransactionIdStp(stpTransId.stpTransactionId);
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          transactions_detail: {
            some: {
              stp_transaction_id: stpTransId.stpTransactionId,
            },
          },
        },
        include: {
          transactions_detail: true,
        },
      });

      // const transactionState = await this.transactionStateUsecasesProxy
      //   .getInstance()
      //   .findById(transaction.status);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const transactionState = await this.prisma.transaction_state.findUnique({
        where: { id: transaction.status },
      });

      const res = {
        transactionId: transaction.id,
        status: String(transactionState?.state) ?? null,
        statusCode: transaction.status,
      };
      return response.status(200).json(res);
    } catch (error) {
      // throw new BadRequestException(
      //   'Error finding transaction or transactionState',
      //   error,
      // );
      throw new Error('Error finding transaction or transactionState');
    }
  }

  /*@Post()
  create(@Body() createStpDto: CreateStpDto) {
    return this.stpService.create(createStpDto);
  }

  @Get()
  findAll() {
    return this.stpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStpDto: UpdateStpDto) {
    return this.stpService.update(+id, updateStpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stpService.remove(+id);
  }*/
}

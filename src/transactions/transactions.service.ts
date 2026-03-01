import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CommissionCalculationReturn } from './dto/commissionCalculation';
import { PrismaService } from 'src/prisma/prisma.service';
// import { PomeloService } from 'src/pomelo/pomelo.service';
import { NewTransactionDTO, TransactionSatusHistoryDTO } from './dto/transaction.dto';
import { DecimalOperations } from 'src/utils/decimalHelpers/decimalOperations';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    // private readonly pomeloService: PomeloService, // PomeloService
    private readonly decimalOperations: DecimalOperations, // Decimal.js
    private readonly configService: ConfigService
  ) { }

  async createTransactionRecord(data: any): Promise<any> {
    try {
      // const commissionDetail = await this.transactionCommissionUsecasesProxy
      //   .getInstance()
      //   .findById(data.transaction_commission_id);
      const commissionDetail = await this.prismaService.transaction_commission.findUnique({
        where: { id: data.transaction_commission_id },
      });
      if (!commissionDetail) {
        throw new Error('Commission details not found');
      }
      const amountDetail = await this.calculateCommission({
        amount: +data.amount,
        operationId: commissionDetail.transaction_operation_id,
        operationType: commissionDetail.transaction_type_id,
      });
      // const lastTransaction = await this.transactionsService.getBalanceByUser(
      //   data.user_id,
      // );

      // const moBalance = await this.pomeloService.getPomeloUserCredit('lcr-31R25xb7APQHzbGtaQbFbCAJj64');
      // this.transactionsService.checkAllowedAmount(
      //   amountDetail.totalValue,
      //   +moBalance.response_data.available_amount,
      // );

      const transactionNew: NewTransactionDTO = {
        account_id: data.account_id,
        transaction_id: data.transaction_id,
        amount: `${amountDetail.initialAmount}`,
        iva_value: String(data.iva),
        commission_value: String(data.commission),
        commission_use: data.commissionUse,
        status: data.status,
        entity: data.entity,
        reference: data.reference,
        details: data.details,
        cycle_id: `123`,
        balance: '100',
        debt: this.calculateDebt(
          200,
          amountDetail.totalValue,
        ),
        user_id: data.user_id,
        transaction_commission_id: amountDetail.transactionCommissionId,
        provider_id: data.provider_id,
        mo_export: false,
      };
      // const response = await this.transactionUsecasesProxy
      //   .getInstance()
      //   .insert(transactionNew);
      const response = await this.prismaService.transaction.create({
        data: {
          id: uuidv4(),
          amount: transactionNew.amount,
          iva_value: transactionNew.iva_value,
          commission_value: transactionNew.commission_value,
          commission_use: transactionNew.commission_use,
          status: transactionNew.status,
          entity: transactionNew.entity,
          reference: transactionNew.reference && transactionNew.reference.length === 36 ? transactionNew.reference : undefined,
          details: transactionNew.details,
          cycle_id: transactionNew.cycle_id && transactionNew.cycle_id.length === 36 ? transactionNew.cycle_id : undefined,
          balance: transactionNew.balance,
          debt: transactionNew.debt,
          user_id: transactionNew.user_id,
          transaction_commission_id: transactionNew.transaction_commission_id,
          provider_id: transactionNew.provider_id && transactionNew.provider_id.length === 36 ? transactionNew.provider_id : undefined,
          mo_export: transactionNew.mo_export,
        },
      });

      const historyTran: TransactionSatusHistoryDTO = {
        transaction_id: response.id,
        status: data.status,
        date_created: new Date(),
      };

      // await this.transactionStatusHistoryUseCasesProxy
      //   .getInstance()
      //   .insert(historyTran);
      await this.prismaService.transaction_status_history.create({
        data: historyTran,
      });

      const newTransactionDetail: any = {
        transaction_id: response.id,
        account_id: data.account_id,
        date_created: new Date(),
        clave_rastreo: data.claveRastreo,
      };

      if (this.configService.get('PROVIDER_STP') == data.provider_id) {
        newTransactionDetail.stp_transaction_id = data.transaction_id;
      }

      if (this.configService.get('PROVIDER_UNDOSTRES') == data.provider_id) {
        newTransactionDetail.undostres_transaction_id = data.transaction_id;
      }

      // await this.transactionDetailUsecasesProxy
      //   .getInstance()
      //   .insert(newTransactionDetail);
      await this.prismaService.transactions_detail.create({
        data: newTransactionDetail,
      });

      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async calculateCommission(amountData: {
    amount: number;
    operationId: number;
    operationType: number;
  }): Promise<CommissionCalculationReturn> {
    amountData.amount = this.roundToTwoDecimalsNumber(amountData.amount);
    // const transactionCommission = await this.transactionCommissionUsecasesProxy
    //   .getInstance()
    //   .findByOperationId(amountData.operationId, amountData.operationType);
    const transactionCommission = await this.prismaService.transaction_commission.findFirst({
      where: {
        transaction_operation_id: amountData.operationId,
        transaction_type_id: amountData.operationType,
      },
    });

    if (!transactionCommission) {
      throw new Error('Transaction commission not found for the given operation.');
    }

    const commissionBase = +transactionCommission.commission_value;
    const commissionIva = +transactionCommission.iva / 100;
    let ivaInCommission = commissionBase + commissionBase * commissionIva;

    if (transactionCommission.is_absolute) {
      return {
        transactionCommissionId: transactionCommission.id,
        totalValue: this.roundToTwoDecimalsNumber(
          +amountData.amount + ivaInCommission,
        ),
        commissionAmountWithoutIva:
          this.roundToTwoDecimalsNumber(commissionBase),
        commissionIvaCalculation: this.roundToTwoDecimalsNumber(
          commissionBase * commissionIva,
        ),
        iva: this.roundToTwoDecimalsNumber(commissionIva * 100),
        initialAmount: amountData.amount,
      };
    }

    const relativeCommission =
      +amountData.amount * (+transactionCommission.commission_value / 100);
    ivaInCommission = relativeCommission + relativeCommission * commissionIva;

    return {
      transactionCommissionId: transactionCommission.id,
      totalValue: this.roundToTwoDecimalsNumber(
        +amountData.amount + ivaInCommission,
      ),
      commissionAmountWithoutIva:
        this.roundToTwoDecimalsNumber(relativeCommission),
      commissionIvaCalculation: this.roundToTwoDecimalsNumber(
        relativeCommission * commissionIva,
      ),
      iva: this.roundToTwoDecimalsNumber(commissionIva * 100),
      initialAmount: amountData.amount,
    };
  }

  safeToFixed(value: number, digits: number): string {
    if (!isNaN(value)) {
      return value.toFixed(digits);
    } else {
      throw new Error(
        `El valor ${value} proporcionado no es un número válido.`,
      );
    }
  }

  roundToTwoDecimalsString(num: number): string {
    const roundedNumber = this.safeToFixed(num, 2);
    return roundedNumber;
  }

  roundToTwoDecimalsNumber(num: number): number {
    const roundedNumber = parseFloat(this.safeToFixed(num, 2));
    return roundedNumber;
  }

  calculateDebt(debt: number, amount: number): string {
    return this.roundToTwoDecimalsString(debt + amount);
  }

  calculateBalance(balance: number, amount: number): string {
    return this.roundToTwoDecimalsString(balance - amount);
  }

  async checkBalanceAndCommission(
    data: CalculateCommissionQuery,
  ): Promise<CalculateCommissionResponse> {
    try {
      // const lastTransaction = await this.getBalanceByUser(data.userId);
      // if (!lastTransaction) {
      //   throw new BadRequestException(
      //     'El Usuario no cuenta con credito o con monto asignado',
      //   );
      // }

      // if (lastTransaction.transaction_type == 4) {
      //   throw new BadRequestException('El Usuario se encuentra en mora');
      // }

      // const moBalance = await this.moService.getCustomerBalance(data.userId.toString());

      // const pomeloBalance = await this.pomeloService.getPomeloUserCredit('lcr-31R25xb7APQHzbGtaQbFbCAJj64');

      const res = await this.calculateCommission({
        amount: data.amount,
        operationId: data.operationId,
        operationType: data.operationType,
      });
      if (!res) {
        throw new Error('Error calculating commission');
      }
      const comission = {
        transactionCommissionId: res.transactionCommissionId,
        totalValue: res.totalValue,
        commissionAmountWithoutIva: res.commissionAmountWithoutIva,
        commissionIvaCalculation: res.commissionIvaCalculation,
        iva: res.iva,
        initialAmount: res.initialAmount,
      };

      // if (this.decimalOperations.greaterThan(comission.totalValue, pomeloBalance?.data?.balances?.single_payment?.available || 0,)) {
      //   // throw new BadRequestException(
      //   //   `El monto total de ${comission.totalValue} (incluyendo la comisión) excede los fondos disponibles de ${pomeloBalance?.data?.balances?.single_payment?.available} con los que cuenta el cliente.`,
      //   // );
      //   throw new Error(`El monto total de ${comission.totalValue} (incluyendo la comisión) excede los fondos disponibles de ${pomeloBalance?.data?.balances?.single_payment?.available} con los que cuenta el cliente.`,);
      // }

      console.log('Comisión calculada:', comission);
      return comission;
    } catch (err) {
      throw new Error(err.message);
    }
  }


  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

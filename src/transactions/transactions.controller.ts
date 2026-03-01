import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { OperationTypesResponse } from './dto/operationType';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommissionCalculationReturn } from './dto/commissionCalculation';

@Controller('transaction')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly prismaService: PrismaService,
  ) { }

  @Get('operationTypes')
  async getAllOperationTypes(): Promise<any> {
    try {
      // const response = await this.transactionsService.getAllOperationTypes();
      const operationTypes = await this.prismaService.transaction_operation.findMany();

      if (!operationTypes) {
        throw new Error('No operation types found');
      }

      const operationTypesFormated: OperationTypesResponse[] =
        operationTypes.map((operation) => {
          return {
            id: operation.id,
            name: operation.name,
            code: operation.code,
          };
        });

      return { data: operationTypesFormated };
    } catch (err) {
      throw Error('Error fetching operation types');
    }
  }

  @Post('calculateCommission')
  async calculateCommission(
    @Body()
    amountData: {
      amount: number;
      operationId: number;
      operationType: number;
    },
  ): Promise<any> {
    try {
      const response =
        await this.transactionsService.calculateCommission(amountData);
      return {data: response};
    } catch (err) {
      throw new Error('Error calculating commission');
    }
  }


  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}

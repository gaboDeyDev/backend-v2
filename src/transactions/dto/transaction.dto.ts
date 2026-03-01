import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

interface BaseTransaction {
  transaction_id?: string;
  amount: string;
  iva_value: string;
  commission_value: string;
  status: number;
  entity?: number;
  reference?: string;
  details: string;
  cycle_id: string;
  balance: string;
  debt: string;
  user_id: number;
  transaction_commission_id: number;
  provider_id?: string;
}

export class NewTransactionDTO implements BaseTransaction {
  @IsOptional()
  @IsInt()
  account_id?: number;

  @IsNotEmpty()
  @IsNumberString()
  transaction_id: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsNumberString()
  iva_value: string;

  @IsNotEmpty()
  @IsNumberString()
  commission_value: string;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsOptional()
  @IsInt()
  entity?: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsString()
  cycle_id: string;

  @IsNotEmpty()
  @IsString()
  balance: string;

  @IsNotEmpty()
  @IsString()
  debt: string;

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  transaction_commission_id: number;

  @IsOptional()
  provider_id: string;

  @IsOptional()
  @IsBoolean()
  mo_export: boolean;

  @IsOptional()
  @IsString()
  commission_use?: string;


}

interface BaseTransactionParams {
  account_id?: number;
  transaction_id: string;
  amount: string;
  status: number;
  entity?: number;
  reference?: string;
  details: string;
  user_id: number;
  transaction_commission_id: number;
  provider_id?: string;
}

export class ParamsTransactionDTO implements BaseTransactionParams {
  @IsOptional()
  @IsInt()
  account_id?: number;

  @IsNotEmpty()
  @IsString()
  transaction_id: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsOptional()
  @IsInt()
  entity?: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  claveRastreo?: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  transaction_commission_id: number;

  @IsOptional()
  provider_id: string;
}

export class TransactionDTO {
  @IsOptional()
  @IsInt()
  account_id?: number;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsDateString()
  date_created: Date;

  @IsNotEmpty()
  @IsDateString()
  date_updated: Date;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsNumberString()
  iva_value: string;

  @IsNotEmpty()
  @IsNumberString()
  commission_value: string;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsOptional()
  @IsInt()
  entity?: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsString()
  cycle_id: string;

  @IsNotEmpty()
  @IsString()
  balance: string;

  @IsNotEmpty()
  @IsString()
  debt: string;

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  transaction_commission_id: number;

  @IsOptional()
  provider_id: string;
}

export class TransactionSatusHistoryDTO {
  @IsNotEmpty()
  @IsNumberString()
  transaction_id: string;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsString()
  @IsOptional()
  status_data?: string;

  @IsOptional()
  @IsDateString()
  date_created?: Date;
}

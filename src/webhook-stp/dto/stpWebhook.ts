import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  empresa: string;

  @IsNotEmpty()
  @IsString()
  claveRastreo: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['LQ', 'CN', 'D'])
  estado: string;

  @IsString()
  causaDevolucion: string;

  @IsNotEmpty()
  @IsString()
  tsLiquidacion: string;
}

export class SendAbonoDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  fechaOperacion: number;

  @IsNotEmpty()
  @IsNumber()
  institucionOrdenante: number;

  @IsNotEmpty()
  @IsNumber()
  institucionBeneficiaria: number;

  @IsNotEmpty()
  @IsString()
  claveRastreo: string;

  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @IsNotEmpty()
  @IsString()
  nombreOrdenante: string;

  @IsNotEmpty()
  @IsNumber()
  tipoCuentaOrdenante: number;

  @IsNotEmpty()
  @IsString()
  cuentaOrdenante: string;

  @IsNotEmpty()
  @IsString()
  rfcCurpOrdenante: string;

  @IsNotEmpty()
  @IsString()
  nombreBeneficiario: string;

  @IsNotEmpty()
  @IsNumber()
  tipoCuentaBeneficiario: number;

  @IsNotEmpty()
  @IsString()
  cuentaBeneficiario: string;

  @IsNotEmpty()
  @IsString()
  nombreBeneficiario2: string;

  @IsNotEmpty()
  @IsNumber()
  tipoCuentaBeneficiario2: number;

  @IsNotEmpty()
  @IsString()
  cuentaBeneficiario2: string;

  @IsNotEmpty()
  @IsString()
  rfcCurpBeneficiario: string;

  @IsNotEmpty()
  @IsString()
  conceptoPago: string;

  @IsNotEmpty()
  @IsString()
  referenciaNumerica: string;

  @IsNotEmpty()
  @IsString()
  empresa: string;

  @IsNotEmpty()
  @IsNumber()
  tipoPago: number;

  @IsNotEmpty()
  @IsString()
  tsLiquidacion: string;

  @IsOptional()
  @IsString()
  folioCodi?: string;
}

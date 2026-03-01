import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class TransferDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  nombreBeneficiario: string;

  @IsOptional()
  @IsString()
  rfcCurpBeneficiario?: string;

  @IsNotEmpty()
  @IsString()
  cuentaBeneficiario: string;

  @IsNotEmpty()
  @IsString()
  tipoCuentaBeneficiario: string;

  @IsNotEmpty()
  @IsString()
  monto: string;

  @IsNotEmpty()
  @IsString()
  conceptoPago: string;

  @IsNotEmpty()
  @IsString()
  institucionContraparte: string;

  @IsNotEmpty()
  @IsString()
  latitud: string;

  @IsNotEmpty()
  @IsString()
  longitud: string;

    @IsOptional()
  commissionTransfer?: string;

  @IsOptional()
  commissionUse?: string;

  @IsOptional()
  iva?: string;
}

export class QueryBalanceAccountDto {
  @IsNotEmpty()
  @IsString()
  cuentaOrdenante: string;

  @IsNotEmpty()
  @IsString()
  empresa: string;

  @IsOptional()
  @IsInt()
  fecha?: number;
}

export class ConciliationDto {
  @IsNotEmpty()
  @IsString()
  tipoOrden: string;

  @IsNotEmpty()
  @IsString()
  empresa: string;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  fecha?: number;
}

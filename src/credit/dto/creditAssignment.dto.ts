import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserData {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsString()
  CURP?: string;
}

export class UpdateCreditAmount {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsInt()
  percentage?: number;

  @IsOptional()
  @IsInt()
  newAmount?: number;
}

export class GetEmailData {
  @IsNotEmpty()
  @IsString()
  email: string;
}

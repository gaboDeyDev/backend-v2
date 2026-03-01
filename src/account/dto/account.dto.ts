import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';
// import { NewAccount, NewMainAccount } from 'src/domain/types/account';

export class UpdateAccountCreditStatusDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsBoolean()
  is_activate: boolean;
}

export class Account {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  account_holder: string;

  @IsNotEmpty()
  @IsInt()
  account_type_id: number;

  @IsNotEmpty()
  @IsNumberString()
  account_number: string;

  @IsNotEmpty()
  @IsInt()
  bank_id: number;
}

export class MainAccount {
  id?: number;

  @IsNotEmpty()
  @IsInt()
  document_type_id: number;

  @IsNotEmpty()
  @IsString()
  document_number: string;

  @IsNotEmpty()
  @IsIn([true])
  is_main_account: true;

  @IsNotEmpty()
  @IsIn([true])
  is_activate: true;
}

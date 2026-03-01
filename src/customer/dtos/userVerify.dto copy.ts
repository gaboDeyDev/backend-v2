import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PaginationDto } from './common.dto';

export class UserVerifiedDto {
  @IsString()
  @IsNotEmpty()
  names: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @Matches(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)
  @IsString()
  @IsNotEmpty()
  birthPlace: string;

  @Matches(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsIn(['Male', 'Female', 'Other'])
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty() // Adjust the maximum length as needed
  address: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  residenceState: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  residenceCountry: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  curp: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  rfc: string;

  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  kycData: string;

  @IsBoolean()
  @IsOptional()
  dataAgreement?: boolean;

  @IsBoolean()
  @IsOptional()
  termsAgreement?: boolean;

  @IsString()
  @IsNotEmpty()
  identityNumber: string;

  @IsString()
  @IsNotEmpty()
  identityType: string;

  @IsString()
  @IsNotEmpty()
  legal_street_name: string;

  @IsNumber()
  @IsNotEmpty()
  legal_street_number: number;

  @IsOptional()
  legal_floor: number | string;

  @IsString()
  @IsOptional()
  legal_apartment: string;
  
  @IsString()
  @IsNotEmpty()
  legal_zip_code: string;

  @IsString()
  @IsNotEmpty()
  legal_neighborhood: string;

  @IsString()
  @IsNotEmpty()
  legal_city: string;

  @IsString()
  @IsNotEmpty()
  legal_region: string;

  @IsString()
  @IsNotEmpty()
  legal_municipality: string;

  @IsString()
  @IsOptional()
  legal_additional_info: string;

  @IsString()
  @IsNotEmpty()
  fathersLastname: string;

  @IsString()
  @IsNotEmpty()
  mothersLastname: string;
}

export class UpdateUserVerifiedDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Matches(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)
  @IsString()
  @IsNotEmpty()
  birthState: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  names: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @Matches(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsIn(['Male', 'Female', 'Other'])
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty() // Adjust the maximum length as needed
  address: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  residenceState: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  residenceCountry: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  curp: string;

  @IsString() // Adjust the maximum length as needed
  @IsNotEmpty()
  rfc: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  credit?: string;
}

export class UpdateUserVerifiedCreditDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  credit?: string;
}

export class UserVerifiedFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsIn(['id', 'names', 'lastname', 'email', 'web_validation', 'app_id'])
  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: string;
}

import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class Email {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class SendEmail {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsIn(['WEB', 'APP'])
  readonly origin: string;
}

export class VerifyCodeMail extends Email {
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsOptional()
  @IsString()
  // @IsIn(USER_TYPES)
  // type: UserType & undefined;
  readonly type?: string;
}

export class SendCodeSMS extends Email {
  @IsNotEmpty()
  // @Matches(phoneNumberRegexp)
  readonly number: string;
}

export class VerifyCodeSMS extends SendCodeSMS {
  @IsNotEmpty()
  readonly code: string;
}

export class Login extends Email {
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class Referesh extends Email {
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}

export class SignUp extends Login {}

export class CreateAdmin extends Login {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  // @IsIn(CHARGES)
  // readonly charge: Charge;
  readonly charge: string;

  @IsString()
  @IsNotEmpty()
  // @IsIn(ROLES)
  // readonly role: Role;
  readonly role: string;
}

// export class BodyRecoverPass extends Email implements bodyRecoverPass {
export class BodyRecoverPass {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  confirmationCode: string;
}

export class BoRecoverPass {

  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  code: string;

}
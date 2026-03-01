import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AccountKeysDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}
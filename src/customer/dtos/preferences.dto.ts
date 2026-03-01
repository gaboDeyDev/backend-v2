import { IsIn, IsNumberString } from 'class-validator';

export class UpdateUserPreferencesDto {
    @IsNumberString()
    @IsIn(['0', '1'])
    acceptsAdvertising: string;

    @IsNumberString()
    @IsIn(['0', '1'])
    acceptsAccountStatements: boolean;
}
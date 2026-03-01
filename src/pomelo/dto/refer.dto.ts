import {
  IsNotEmpty,
  IsString,
  Matches,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';

export class referDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['cash', 'spei'])
  type: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @Matches(/^\d+(\.\d{1,2})?$/)
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}



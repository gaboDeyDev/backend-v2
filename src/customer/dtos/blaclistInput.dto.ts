import { Type, instanceToPlain, plainToClass } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Address, Person } from './BlacklistModel';

export class DomicilioDTO implements Address {
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  coloniaPoblacion: string;

  @IsString()
  @IsNotEmpty()
  delegacionMunicipio: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  CP: string;

  public toPlainObject(): Address {
    return instanceToPlain(this) as Address;
  }
}

export class PersonaDTO implements Person {
  @IsString()
  @IsNotEmpty()
  apellidoPaterno: string;

  @IsString()
  @IsNotEmpty()
  apellidoMaterno: string;

  @IsString()
  @IsNotEmpty()
  primerNombre: string;

  @IsDateString()
  @IsNotEmpty()
  fechaNacimiento: string;

  @IsString()
  @IsNotEmpty()
  RFC: string;

  @IsString()
  @IsNotEmpty()
  nacionalidad: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DomicilioDTO)
  domicilio: DomicilioDTO;

  public toPlainObject(): Person {
    return plainToClass(PersonaDTO, instanceToPlain(this) as Person);
  }
}

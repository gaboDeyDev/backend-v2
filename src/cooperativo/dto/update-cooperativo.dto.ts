import { PartialType } from '@nestjs/mapped-types';
import { CreateCooperativoDto } from './create-cooperativo.dto';

export class UpdateCooperativoDto extends PartialType(CreateCooperativoDto) {}

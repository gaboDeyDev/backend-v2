import { PartialType } from '@nestjs/mapped-types';
import { CreateTruoraDto } from './create-truora.dto';

export class UpdateTruoraDto extends PartialType(CreateTruoraDto) {}

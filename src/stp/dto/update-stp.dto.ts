import { PartialType } from '@nestjs/mapped-types';
import { CreateStpDto } from './create-stp.dto';

export class UpdateStpDto extends PartialType(CreateStpDto) {}

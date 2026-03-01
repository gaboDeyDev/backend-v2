import { PartialType } from '@nestjs/mapped-types';
import { CreatePomeloDto } from './create-pomelo.dto';

export class UpdatePomeloDto extends PartialType(CreatePomeloDto) {}

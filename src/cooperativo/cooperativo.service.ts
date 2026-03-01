import { Injectable } from '@nestjs/common';
import { CreateCooperativoDto } from './dto/create-cooperativo.dto';
import { UpdateCooperativoDto } from './dto/update-cooperativo.dto';

@Injectable()
export class CooperativoService {
  create(createCooperativoDto: CreateCooperativoDto) {
    return 'This action adds a new cooperativo';
  }

  findAll() {
    return `This action returns all cooperativo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cooperativo`;
  }

  update(id: number, updateCooperativoDto: UpdateCooperativoDto) {
    return `This action updates a #${id} cooperativo`;
  }

  remove(id: number) {
    return `This action removes a #${id} cooperativo`;
  }
}

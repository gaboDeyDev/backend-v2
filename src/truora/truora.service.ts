import { Injectable } from '@nestjs/common';
import { CreateTruoraDto } from './dto/create-truora.dto';
import { UpdateTruoraDto } from './dto/update-truora.dto';

@Injectable()
export class TruoraService {
  create(createTruoraDto: CreateTruoraDto) {
    return 'This action adds a new truora';
  }

  findAll() {
    return `This action returns all truora`;
  }

  findOne(id: number) {
    return `This action returns a #${id} truora`;
  }

  update(id: number, updateTruoraDto: UpdateTruoraDto) {
    return `This action updates a #${id} truora`;
  }

  remove(id: number) {
    return `This action removes a #${id} truora`;
  }
}

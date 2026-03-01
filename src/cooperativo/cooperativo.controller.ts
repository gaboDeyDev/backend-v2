import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CooperativoService } from './cooperativo.service';
import { CreateCooperativoDto } from './dto/create-cooperativo.dto';
import { UpdateCooperativoDto } from './dto/update-cooperativo.dto';

@Controller('cooperativo')
export class CooperativoController {
  constructor(private readonly cooperativoService: CooperativoService) {}

  @Post()
  create(@Body() createCooperativoDto: CreateCooperativoDto) {
    return this.cooperativoService.create(createCooperativoDto);
  }

  @Get()
  findAll() {
    return this.cooperativoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperativoDto: UpdateCooperativoDto) {
    return this.cooperativoService.update(+id, updateCooperativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativoService.remove(+id);
  }
}

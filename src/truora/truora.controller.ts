import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TruoraService } from './truora.service';
import { CreateTruoraDto } from './dto/create-truora.dto';
import { UpdateTruoraDto } from './dto/update-truora.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('truora')
export class TruoraController {
  constructor(
    private readonly truoraService: TruoraService,
    private readonly prisma: PrismaService,
  ) { }

  @Post('webhook/signingResult')
  async saveSigningResult(@Body() data: TruoraSigningResultResponse) {
    try {
      const dataString = JSON.stringify(data);

      // Get the last id from signing_result table
      const lastRecord = await this.prisma.signing_result.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      const nextId = lastRecord ? lastRecord.id + 1 : 1;

      const response = await this.prisma.signing_result.create({
        data: {
          id: nextId,
          email: data.signer_who_signed?.email,
          contract_token: data.token ?? '',
          object: dataString,
          event_type: data.event_type ?? '',
        }
      });

      return {
        id: response.id,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  create(@Body() createTruoraDto: CreateTruoraDto) {
    return this.truoraService.create(createTruoraDto);
  }

  @Get()
  findAll() {
    return this.truoraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.truoraService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTruoraDto: UpdateTruoraDto) {
    return this.truoraService.update(+id, updateTruoraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.truoraService.remove(+id);
  }
}

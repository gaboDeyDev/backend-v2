import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PomeloService } from './pomelo.service';
import { CreatePomeloDto } from './dto/create-pomelo.dto';
import { UpdatePomeloDto } from './dto/update-pomelo.dto';
import { CreatePomeloUserDto } from './dto/create-pomelo-user.dto';
import { CreatePomeloAccountDto } from './dto/create-pomelo-account.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pomelo')
export class PomeloController {
  constructor(
    private readonly pomeloService: PomeloService,
  ) { }

  @Post()
  create(@Body() createPomeloDto: CreatePomeloDto) {
    return this.pomeloService.create(createPomeloDto);
  }

  @Get()
  findAll() {
    return this.pomeloService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pomeloService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePomeloDto: UpdatePomeloDto) {
  //   return this.pomeloService.update(+id, updatePomeloDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pomeloService.remove(+id);
  // }

  @Get('/users')
  getPomeloUsers() {
    return this.pomeloService.getPomeloUsers();
  }

  @Post('create-user-pomelo')
  createUserPomelo(@Body() createPomeloDto: CreatePomeloUserDto) {
    return this.pomeloService.createUserPomelo(createPomeloDto);
  }

  @Post('create-pomelo-account')
  createPomeloAccount(@Body() createPomeloDto: CreatePomeloAccountDto) {
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return this.pomeloService.createPomeloAccount(createPomeloDto, idempotencyKey);
  }


  @Post('create-physical-card/:email')
  createPhysicalCard(@Param('email') email: string) {
    return this.pomeloService.createPhysicalCard(email);
  }

  @Get('calculate-refinancing/:amount/:interestRate')
  calculateRefinancing(
    @Param('amount') amount: number,
    @Param('interestRate') interestRate: number,
  ): any {
    return this.pomeloService.createRefinancing(amount, interestRate);
  }

  @Post('verifyMorality/all')
  verifyMoralityAll() {
    return this.pomeloService.verifyMoralityAll();
  }

  @Post('delete-account')
  deleteAccount(@Body('email') email: string) {
    return this.pomeloService.deleteAccount(email);
  }

}

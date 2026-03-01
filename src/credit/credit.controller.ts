import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { PomeloService } from 'src/pomelo/pomelo.service';
import { GetUserData } from './dto/creditAssignment.dto';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('credit')
export class CreditController {
  constructor(
    private readonly creditService: CreditService,
    private readonly pomeloService: PomeloService,
    private readonly prisma: PrismaService
  ) { }

  @Get('customer-information/:email')
  async getCustomerInformation(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    const result = await this.pomeloService.getCustomerInformation(email);
    return response.status(200).json(result);
  }

  @Get('customer-inputaciones/:email')
  async getCustomerInputaciones(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    const result = await this.pomeloService.getCustomerInputaciones(email);
    return response.status(200).json(result);
  }

  @Post('user-data')
  async getUserData(
    @Res() response: Response,
    @Body() { CURP, id }: GetUserData): Promise<any> {
    const result = await this.pomeloService.getUserData(String(CURP), id);
    return response.status(200).json(result);
  }

  @Get('get-virtual-card-info/:email')
  async getVirtualCardInfo(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    const result = await this.pomeloService.getPomeloSecureData(email);
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(result);
  }


  @Get('get-phisycal-card-info/:email')
  async getPhisycalCardInfo(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    const result = await this.pomeloService.getPomeloPhisycalSecureData(email);
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(result);
  }


  @Patch('update-card')
  async updatePomeloCard(
    @Res() response: Response,
    @Body() body: any
  ): Promise<any> {
    const result = await this.pomeloService.updatePomeloCard(body);
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(result);
  }

  @Patch('update-card-pin')
  async updatePinPomeloCard(
    @Res() response: Response,
    @Body() body: any
  ): Promise<any> {
    const result = await this.pomeloService.updatePomeloCardPin(body);
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(result);
  }


  @Get('get-change-pin-card/:email')
  async getChangePinCard(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    const result = await this.pomeloService.getPomeloChangePinCard(email);
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(result);
  }

  @Get('get-activate-card/:email')
  async getActivateCard(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    const result = await this.pomeloService.getPomeloActivateCard(email);
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(result);
  }

  @Get('spei-reference/:email')
  async getSpeiReference(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    console.log('Email for SPEI Reference:', email);
    const result = await this.pomeloService.getSpeiReference(email);
    return response.status(200).json(result);
  }

  @Get('get-phisycal-card-status/:email')
  async getStatus(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    console.log('Email for SPEI Reference:', email);
    const result = await this.pomeloService.getPhisycalCardStatus(email);
    return response.status(200).json(result);
  }


  @Get('get-virtual-card-status/:email')
  async getStatusVirtual(
    @Res() response: Response,
    @Param('email') email: string,
  ): Promise<any> {
    console.log('Email for SPEI Reference:', email);
    const result = await this.pomeloService.getVirtualCardStatus(email);
    return response.status(200).json(result);
  }

  @Post('activate-physical-card/:email')
  async activatePhysicalCard(
    @Res() response: Response,
    @Param('email') email: string,
    @Body() body: any
  ): Promise<any> {
    console.log('Email for Activate Physical Card:', email);
    const result = await this.pomeloService.activePhisicalCard(email);
    return response.status(200).json(result);
  }

  @Post('verify-identity/:email')
  async verifyIdentity(
    @Res() response: Response,
    @Param('email') email: string,
    @Body() body: any
  ): Promise<any> {
    console.log('Email for Activate Physical Card:', email);
    const result = await this.pomeloService.verifyIdentity(email);
    return response.status(200).json(result);
  }



  @Post('save-sign/:email')
  async saveSign(
    @Param('email') email: string
  ) {
    const result = await this.pomeloService.saveSign(email);
    return {
      statusCode: 200,
      data: result
    };
  }
  @Post('references')
  async references(
    @Body() body: any) {
    const email = body['email'];
    console.log('Email for References:', email);
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    console.log('User for References:', user);
    console.log( { ...body, id: user?.id, email: email, amount: '1' })
    return this.pomeloService.generateReference(String(user?.id), { ...body, id: user?.id, email: email, amount: '2' });
  }

  @Get('get-reference/:email')
  async getReference(
    @Param('email') email: string,
    @Res() response: Response
  ): Promise<any> {
    try {
      console.log('Email for Get Reference:', email);
      const reference = await this.pomeloService.getReferenceIfExist(email);
      return response.status(200).json(reference);
    } catch (error) {
      return response.status(404).json({ message: 'Reference not found' });
    }
  }

  @Post('reference-delete/:id')
  async deleteReference(
    @Param('id') id: string,
    @Res() response: Response
  ): Promise<any> {
    try {
      const result = await this.pomeloService.deleteReference(id);
      return response.status(200).json({ message: 'Reference deleted', result });
    } catch (error) {
      return response.status(404).json({ message: 'Reference not found' });
    }
  }

  @Get('get-cobranza/:email')
  async getCobranza(
    @Param('email') email: string,
    @Res() response: Response
  ): Promise<any> {
    console.log('Email for Get Cobranza:', email);
    const result = await this.pomeloService.getCobranzaCard(email);
    return response.status(200).json(result);
  }

  /*@Post()
  create(@Body() createCreditDto: CreateCreditDto) {
    return this.creditService.create(createCreditDto);
  }

  @Get()
  findAll() {
    return this.creditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditDto: UpdateCreditDto) {
    return this.creditService.update(+id, updateCreditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditService.remove(+id);
  }*/
}

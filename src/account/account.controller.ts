import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account, UpdateAccountCreditStatusDto } from './dto/account.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly prismaService: PrismaService,
  ) { }

  // new versions

  @Get()
  async findAll() {
    return this.accountService.findAll();
  }

  @Get('findAllByUserId/:email')
  async findAllByUserEmail(@Param('email') email: string) {
    return this.accountService.findAllByUserEmail(email);
  }

  @Get('getIdAccount/:userId')
  async getIdAccount(
    @Param('userId') userId: number
  ) {
    return this.accountService.getIdAccount(Number(userId));
  }

  @Post('/mainAccount')
  async createMainAccount(@Body() data: any) {
    return this.accountService.createMainAccount(data);
  }

  @Post()
  async createAccount(@Body() data: Account) {
    return this.accountService.createAccount(data);
  }

  @Put('updateAccountCardStatus')
  async changeAccountCardStatus(
    @Body() updateCardStatusDto: UpdateAccountCreditStatusDto,
  ) {
    return this.accountService.updateAccountCardStatus(updateCardStatusDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.accountService.deleteAccount(Number(id));
  }

  @Post('profile-image/:email')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    await this.prismaService.user.update({
      where: { email },
      data: { profile_image: file.buffer },
    });

    return { message: 'Imagen guardada correctamente' };
  }

  @Post('save-token-cobranza/:email')
  async saveTokenCobranza(
    @Param('email') email: string,
    @Body('token') token: string, 
    @Body('cardNumber') cardNumber: string,
    @Body('cardYear') cardYear: string,
    @Body('cardMonth') cardMonth: string
  ) {
    await this.prismaService.users_info_card.create({
      data: {
        email,
        card: cardNumber,
        month: cardMonth,
        year: cardYear
      }
    });
    return this.prismaService.user.update({
      where: { email },
      data: { token_cobranza: token },
    });
  }

  @Get('get-token-cobranza/:email')
  async getTokenCobranza(
    @Param('email') email: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { token_cobranza: true },
    });
    return user?.token_cobranza;
  }
  // old versions
  /*@Get('getIdAccount/:userId/:accountNumber')
  async getIdAccount(
    @Param('userId') userId: number,
    @Param('accountNumber') accountNumber: string,
  ) {
    try {
      // const response = await this.userUsecasesProxy
      //   .getInstance()
      //   .findByAccountNumber(userId, accountNumber);
      const response = await this.prismaService.account.findFirst({
        where: {
          user_id: userId,
          // account_number: accountNumber,
        },
      });

      if (!response) {
        throw new Error('No se ha encontrado ninguna coincidencia');
      }

      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }*/

  /*@Get()
  async findAll() {
    // const response = await this.userUsecasesProxy.getInstance().findAll();
    const response = await this.prismaService.account.findMany();

    return response;
  }*/

  /*@Post('/mainAccount')
  async createMainAccount(@Body() data: any) {
    // const response = await this.userUsecasesProxy
    //   .getInstance()
    //   .createMainAccount(data);

    const user = await this.prismaService.verified_user.findFirst({
      where: { email: data.email },
    });
    const userId = user?.id;
    const response = await this.prismaService.account.create({
      data: {
        user_id: Number(userId),
        account_holder: data.account_holder,
        account_type_id: Number(data.account_type_id),
        account_number: data.account_number,
        bank: Number(data.bank_id),
        is_main_account: true,
        is_activate: true,
        document_type_id: data.document_type_id,
        document_number: data.document_number,
      },
    });

    return { data: response };
  }*/

  /*@Post()
  async createAccount(@Body() data: Account) {
    // const response = await this.userUsecasesProxy.getInstance().insert(data);
    const response = await this.prismaService.account.create({
      data: {
        ...data,
        is_main_account: false,
        is_activate: true,
        bank: data.bank_id // Ensure 'bank' property is provided as required by Prisma schema
      }
    });

    return response;
  }*/

  /*@Put('updateAccountCardStatus')
  async changeAccountCardStatus(
    @Body() updateCardStatusDto: UpdateAccountCreditStatusDto,
  ) {
    const { id, is_activate } = updateCardStatusDto;

    const response = await this.prismaService.account.updateMany({
      where: { id },
      data: { is_activate },
    });

    if (response.count === 0) {
      throw new Error('No se ha encontrado ninguna coincidencia');
    }

    return 'Se ha actualizado el estado de la tarjeta';
  }*/

  /*
@Delete('/:id')
async delete(@Param('id') id: number) {
  // const response = await this.userUsecasesProxy.getInstance().deleteById(id);
  const response = await this.prismaService.account.deleteMany({
    where: { id },
  });
  return response;
}*/

  /*@Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  // @Get()
  // findAll() {
  //   return this.accountService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }*/
}

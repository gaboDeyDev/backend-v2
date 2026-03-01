import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BackofficeService } from './backoffice.service';
import { CreateBackofficeDto } from './dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './dto/update-backoffice.dto';
import { Prisma } from '@prisma/client';

@Controller('backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Post()
  create(@Body() createBackofficeDto: CreateBackofficeDto) {
    return this.backofficeService.create(createBackofficeDto);
  }

  @Post('createUsers')
  createUsers(
    @Body()
    body: {
      createVerifiedUserDto: Prisma.verified_userCreateInput;
      createBackofficeDto: Prisma.userCreateInput;
    },
    // @Body() createVerifiedUserDto: Prisma.verified_userCreateInput,
  ) {
    console.log({ body });
    const createVerifiedUserDto = body.createVerifiedUserDto;
    const createUserDto = body.createBackofficeDto;
    return this.backofficeService.createUsers(
      createUserDto,
      createVerifiedUserDto,
    );
  }

  @Post('loginBO')
  loginBO(
    @Body()
    body: {
      email: string;
      password: string;
    },
    // @Body() createVerifiedUserDto: Prisma.verified_userCreateInput,
  ) {
    console.log({ body });
    const { email, password } = body;
    return this.backofficeService.loginBO(
      email,
      password,
    );
  }

  @Get()
  findAll() {
    return this.backofficeService.findAll();
  }

  @Get('getListUsers')
  findAllUsers(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    console.log({ limit, page, search, status });
    return this.backofficeService.getListUsers(
      limit ? +limit : 10,
      page ? +page : 1,
      search,
      status,
    );
  }

  @Get('getCountStatusUsers')
  getCountStatusUsers() {
    return this.backofficeService.getCountStatusUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backofficeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBackofficeDto: UpdateBackofficeDto,
  ) {
    return this.backofficeService.update(+id, updateBackofficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backofficeService.remove(+id);
  }
}

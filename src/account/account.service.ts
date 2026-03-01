import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account, UpdateAccountCreditStatusDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByUserEmail(email: string) {
    const responseUser = await this.prismaService.verified_user.findFirst({
      where: { email: email },
    });

    if (!responseUser) throw new BadRequestException('User not found');

    const { id } = responseUser;

    const users: any = await this.prismaService.account.findMany({
      where: { user_id: Number(id) },
    });

    return await Promise.all(
      users.map(async (user) => {
        const item = await this.prismaService.list_item.findFirst({
          where: { id: user.bank },
        });

        return {
          ...user,
          bankName: item ? item.display_name : null,
          bankCode: item ? item.code : null,
        };
      }),
    );
  }

  async getIdAccount(userId: number) {
    const response = await this.prismaService.account.findFirst({
        where: {
          user_id: userId,
        },
      });
    
    if(!response) throw new BadRequestException('No se ha encontrado ninguna coincidencia');

    return response;
  }

  async findAll() {
    return this.prismaService.account.findMany();
  }

  async createMainAccount(data: any){
    try {
          const user = await this.prismaService.verified_user.findFirst({
      where: { email: data.email },
    });

    if(!user) throw new BadRequestException('User not found');

    const { id } = user;

    return await this.prismaService.account.create({
      data: {
        user_id: Number(id),
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
    } catch (error) {
      console.log(error);
    }

  }

  async createAccount(data: Account){
    return await this.prismaService.account.create({
      data: {
        ...data,
        is_main_account: false,
        is_activate: true,
        bank: data.bank_id // Ensure 'bank' property is provided as required by Prisma schema
      }
    });
  }

  async updateAccountCardStatus(updateCardStatusDto: UpdateAccountCreditStatusDto){
    const { id, is_activate } = updateCardStatusDto;

    const response = await this.prismaService.account.updateMany({
      where: { id },
      data: { is_activate },
    });

    if(response.count === 0)
      throw new BadRequestException('No se ha encontrado ninguna coincidencia');
    
    return 'Se ha actualizado el estado de la tarjeta';
  }

  async deleteAccount(id: number) {
    const response = await this.prismaService.account.deleteMany({
      where: { id },
    });

    return response;
  }
}

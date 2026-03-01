import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserPomeloService {

    constructor(private readonly prismaService: PrismaService){}

    async getCreditLineUserFromId(id: number){
        return this.prismaService.user.findFirst({ where: { id }, select: { sod_id: true } })
    }

}

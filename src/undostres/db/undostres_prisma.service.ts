import { PrismaClient } from 'schemas/undostres_prisma/generated/prisma';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UndostresPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ datasourceUrl: process.env.UNDOSTRES_DATABASE_URL! });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

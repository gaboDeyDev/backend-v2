import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  constructor(){
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL!
        },
      },
      transactionOptions: {
        maxWait: 50000, // Máximo tiempo de espera antes de fallar
        timeout: 120000, // Tiempo máximo de transacción
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

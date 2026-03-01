import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// import { AccountsPrismaService } from './accounts_prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

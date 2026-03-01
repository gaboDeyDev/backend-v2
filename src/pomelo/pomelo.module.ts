import { Module } from '@nestjs/common';
import { PomeloService } from './pomelo.service';
import { PomeloController } from './pomelo.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { StpModule } from 'src/stp/stp.module';

@Module({
  imports: [CustomerModule, StpModule],
  controllers: [PomeloController],
  providers: [PomeloService],
  exports: [PomeloService],
})
export class PomeloModule {}

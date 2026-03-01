import { Module } from '@nestjs/common';
import { CooperativoService } from './cooperativo.service';
import { CooperativoController } from './cooperativo.controller';

@Module({
  controllers: [CooperativoController],
  providers: [CooperativoService],
})
export class CooperativoModule {}

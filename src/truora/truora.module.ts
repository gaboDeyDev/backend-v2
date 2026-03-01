import { Module } from '@nestjs/common';
import { TruoraService } from './truora.service';
import { TruoraController } from './truora.controller';

@Module({
  controllers: [TruoraController],
  providers: [TruoraService],
})
export class TruoraModule {}

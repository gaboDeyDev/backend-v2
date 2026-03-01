import { Module } from '@nestjs/common';
import { DateFormater } from './dateFormater';
import { DateUtils } from './date';

@Module({
  imports: [DateFormater, DateUtils], 
  exports: [DateFormater, DateUtils],
})
export class DateFormaterModule {}

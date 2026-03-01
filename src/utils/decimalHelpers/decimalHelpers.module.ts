import { Module } from '@nestjs/common';
import { DecimalHelper } from './decimalHelper';
import { DecimalOperations } from './decimalOperations';

@Module({
    imports: [DecimalHelper, DecimalOperations],
    exports: [DecimalHelper, DecimalOperations],
})
export class DecimalHelperModule { }

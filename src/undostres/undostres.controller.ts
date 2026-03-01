import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { CategoryType } from './types/categories.type';
import { UndostresService } from './services/undostres.service';
import { UDTProductDto } from './data/dto/udt_product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelFileInterceptor } from './middleware/excel_file.interceptor';
import { UndostresModel } from './data/model/undostres.model';

@Controller('undostres')
export class UndostresController {

    constructor(private readonly undostresService: UndostresService) {}

    @Get('categories')
    getCategories(): any[] {
        return this.undostresService.getCategories();
    }

    @Get('category/:type')
    async getServicesFromCategory(@Param('type') type: CategoryType) {
        return this.undostresService.availableServices(type);
    }

    @Post('ask/product')
    async askProduct(@Body() { ref, skuid }: UDTProductDto) {
        return this.undostresService.getAmountToPay(skuid, ref);
    }

    @Post('pay/product')
    async payProduct(@Body() { ref, skuid }: UDTProductDto) {
        return this.undostresService.makePayment(skuid, ref);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
        ExcelFileInterceptor
    )
    async loadUndostresFile(@Body('data') data: UndostresModel[]) {
        return this.undostresService.addServices(data);
    }

    @Post('fetch/:skuid')
    async fetchServiceBySkuId(@Param('skuid') skuid: number, @Body('reference') reference: string) {
        return this.undostresService.fetchServiceBySkuId(skuid, reference);
    }

    @Post('Pay')
    async payService(@Body() body: {skuid: number, reference: string, amount: number, userID: number}) {
        return this.undostresService.makePayment(body.skuid, body.reference, body.userID, body.amount);
    }

}

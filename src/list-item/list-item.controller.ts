import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { UpdateListItemDto } from './dto/update-list-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('listItem')
export class ListItemController {
  constructor(
    private readonly listItemService: ListItemService,
    private readonly prisma: PrismaService
  ) { }


  @Get()
  async findAll() {
    // const response = await this.listItemUsecasesProxy.getInstance().findAll();
    const response = await this.prisma.list_item.findMany();
    return response;
  }

  @Get('findAllByTypeId/:catalogTypeId')
  async findAllByTypeId(
    @Param('catalogTypeId') catalogTypeId: number,
    @Query('parentCatalogId') parentCatalogId?: number,
  ) {
    // const response = await this.listItemUsecasesProxy
    //   .getInstance()
    //   .findAllByTypeIdAndParentId(catalogTypeId, parentCatalogId);
    const response = await this.prisma.list_item.findMany({
      where: {
        catalog_type_id: Number(catalogTypeId),
        parent_catalogue_id: parentCatalogId ? parentCatalogId : undefined,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return { data: response };
  }

  @Post()
  create(@Body() createListItemDto: CreateListItemDto) {
    return this.listItemService.create(createListItemDto);
  }

  // @Get()
  // findAll() {
  //   return this.listItemService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listItemService.findOne(+id);
  }

  @Get('codes-temp/get')
  getCodes(@Param('id') id: string) {
    return this.prisma.temp_codes.findMany();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListItemDto: UpdateListItemDto) {
    return this.listItemService.update(+id, updateListItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listItemService.remove(+id);
  }
}

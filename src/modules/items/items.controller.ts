import { Controller, Get, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { ItemsQueryInput } from './dto/items_query_input.dto';
import { Item } from './item.model';
import { ItemsService } from './items.service';

@Controller({
  path: 'items',
  version: '1',
})
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOkResponse({ type: [Item] })
  @ApiInternalServerErrorResponse()
  async getCustomers(@Query() queries: ItemsQueryInput): Promise<Item[]> {
    return this.itemsService.getItems(queries);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateCustomerInput } from './dto/create_customer_input.dto';
import { CustomersQueryInput } from './dto/customers_query_input.dto';
import { CustomerParamInput } from './dto/customer_param_input.dto';
import { UpdateCustomerInput } from './dto/update_customer_input.dto';
import { Customer } from './customer.model';
import { CustomersService } from './customers.service';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOkResponse({ type: Customer })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async createCustomer(@Body() args: CreateCustomerInput): Promise<Customer> {
    return this.customersService.createCustomer(args);
  }

  @Get(':name')
  @ApiOkResponse({ type: Customer })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async getCustomer(@Param() params: CustomerParamInput): Promise<Customer> {
    return this.customersService.getCustomer(params);
  }

  @Get()
  @ApiOkResponse({ type: [Customer] })
  @ApiInternalServerErrorResponse()
  async getCustomers(
    @Query() queries: CustomersQueryInput,
  ): Promise<Customer[]> {
    return this.customersService.getCustomers(queries);
  }

  @Put(':name')
  @ApiOkResponse({ type: Customer })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async updateCustomer(
    @Param() params: CustomerParamInput,
    @Body() args: UpdateCustomerInput,
  ): Promise<Customer> {
    return this.customersService.updateCustomer(params, args);
  }

  @Delete(':name')
  @ApiOkResponse({ type: Boolean })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async deleteCustomer(@Param() params: CustomerParamInput): Promise<boolean> {
    return this.customersService.deleteCustomer(params);
  }
}

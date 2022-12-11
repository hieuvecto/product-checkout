import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CheckoutsService } from './checkouts.service';
import { Checkout } from './checkout.model';
import { CreateCheckoutInput } from './dto/create_checkout_input.dto';
import { CheckoutParamInput } from './dto/checkout_param_input.dto';
import { CheckoutsQueryInput } from './dto/checkouts_query_input.dto';
import { PayCheckoutInput } from './dto/pay_checkout_input.dto';

@Controller({
  path: 'checkouts',
  version: '1',
})
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create the temporary checkout. (status = unpaid) (Has the lines which flow following by the pseudo codes of specification.',
  })
  @ApiOkResponse({ type: Checkout })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async createCheckout(@Body() args: CreateCheckoutInput): Promise<Checkout> {
    return this.checkoutsService.createCheckout(args);
  }

  @Get(':id')
  @ApiOkResponse({ type: Checkout })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async getCheckout(@Param() params: CheckoutParamInput): Promise<Checkout> {
    return this.checkoutsService.getCheckout(params);
  }

  @Get()
  @ApiOkResponse({ type: [Checkout] })
  @ApiInternalServerErrorResponse()
  async getCheckouts(
    @Query() queries: CheckoutsQueryInput,
  ): Promise<Checkout[]> {
    return this.checkoutsService.getCheckouts(queries);
  }

  @Put(':id/pay')
  @ApiOperation({
    summary: 'Process payment in the checkout model, then set status = paid.',
  })
  @ApiOkResponse({ type: Checkout })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async payCheckout(
    @Param() params: CheckoutParamInput,
    @Body() args: PayCheckoutInput,
  ): Promise<Checkout> {
    return this.checkoutsService.payCheckout(params, args);
  }

  @Put(':id/confirm')
  @ApiOperation({
    summary:
      'Confirm the checkout by batch job or admin (Depends on specific requirements). Set status = confirmed.',
  })
  @ApiOkResponse({ type: Checkout })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async confirmeCheckout(
    @Param() params: CheckoutParamInput,
  ): Promise<Checkout> {
    return this.checkoutsService.confirmCheckout(params);
  }

  @Put(':id/cancel')
  @ApiOperation({
    summary:
      'Cancel unconfirmed checkout by batch job or admin (Depends on specific requirements).',
  })
  @ApiOkResponse({ type: Checkout })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async cancelCheckout(@Param() params: CheckoutParamInput): Promise<Checkout> {
    return this.checkoutsService.cancelCheckout(params);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountPricingRule } from './discount_pricing_rule.model';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountPricingRule])],
  exports: [TypeOrmModule],
})
export class DiscountPricingRulesModule {}

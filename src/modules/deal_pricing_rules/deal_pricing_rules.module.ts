import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealPricingRule } from './deal_pricing_rule.model';

@Module({
  imports: [TypeOrmModule.forFeature([DealPricingRule])],
  exports: [TypeOrmModule],
})
export class DealPricingRulesModule {}

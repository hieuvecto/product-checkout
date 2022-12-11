import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { PricingRule } from './pricing_rule.model';
import { PricingRulesService } from './pricing_rules.service';

// TODO: implement CRUD for pricing rules.
@Module({
  imports: [TypeOrmModule.forFeature([PricingRule])],
  providers: [
    PricingRulesService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [PricingRulesService, TypeOrmModule],
})
export class PricingRulesModule {}

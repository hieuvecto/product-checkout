import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { CustomersModule } from '../customers/customers.module';
import { ItemsModule } from '../items/items.module';
import { PricingRulesModule } from '../pricing_rules/pricing_rules.module';
import { Checkout } from './checkout.model';
import { CheckoutsController } from './checkouts.controller';
import { CheckoutsService } from './checkouts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout]),
    CustomersModule,
    PricingRulesModule,
    ItemsModule,
  ],
  controllers: [CheckoutsController],
  providers: [
    CheckoutsService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [CheckoutsService, TypeOrmModule],
})
export class CheckoutsModule {}

import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { DealPricingRulesModule } from 'src/modules/deal_pricing_rules/deal_pricing_rules.module';
import { DiscountPricingRulesModule } from 'src/modules/discount_pricing_rules/discount_pricing_rules.module';
import { ItemsModule } from 'src/modules/items/items.module';
import { getConnectionOptions } from 'typeorm';
import configuration from '../config/configuration';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    CustomersModule,
    ItemsModule,
    DealPricingRulesModule,
    DiscountPricingRulesModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => getConnectionOptions('default'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => getConnectionOptions('reader'),
    }),
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    HttpModule,
  ],
})
export class AppModule {}

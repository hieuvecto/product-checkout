import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutsModule } from 'src/modules/checkouts/checkouts.module';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { ItemsModule } from 'src/modules/items/items.module';
import { PricingRulesModule } from 'src/modules/pricing_rules/pricing_rules.module';
import { getConnectionOptions } from 'typeorm';
import configuration from '../config/configuration';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    CustomersModule,
    ItemsModule,
    PricingRulesModule,
    CheckoutsModule,
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

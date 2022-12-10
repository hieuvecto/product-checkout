import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Customer } from './customer.model';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [CustomersService, TypeOrmModule],
})
export class CustomersModule {}

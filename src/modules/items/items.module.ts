import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Item } from './item.model';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [
    ItemsService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}

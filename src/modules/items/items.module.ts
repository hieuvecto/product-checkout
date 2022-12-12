import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Item } from './item.model';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

// TODO: implement CRUD for items.
@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}

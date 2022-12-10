import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { QueryRunner, Repository } from 'typeorm';
import { Item } from './item.model';

@Injectable()
export class ItemsService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transaction: TransactionInterface,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  private readonly logger = new Logger(ItemsService.name);

  /**
   * Get item records by ids with lock.
   * @throws {Error} sql, db related error.
   */
  public async getItemsByIdsWithLock(
    queryRunner: QueryRunner,
    ids: number[],
  ): Promise<Item[]> {
    return queryRunner.manager
      .getRepository(Item)
      .createQueryBuilder('item')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('item.id in (:...ids)', { ids })
      .andWhere('item.deleted_at is null')
      .getMany();
  }

  /**
   * Get a item record by its id.
   * @throws {Error} sql, db related error.
   */
  public async getItemById(id: number): Promise<Item> {
    return this.itemRepository
      .createQueryBuilder('item')
      .useTransaction(false)
      .where('item.name = :id', { id })
      .andWhere('item.deleted_at is null')
      .getOne();
  }

  /**
   * Get a item record by its id with lock.
   * @throws {Error} sql, db related error.
   */
  public async getItemByIdWithLock(
    queryRunner: QueryRunner,
    id: number,
  ): Promise<Item> {
    return queryRunner.manager
      .getRepository(Item)
      .createQueryBuilder('item')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('item.id = :id', { id })
      .andWhere('item.deleted_at is null')
      .getOne();
  }
}

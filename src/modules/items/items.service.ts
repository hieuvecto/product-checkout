import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { QueryRunner, Repository } from 'typeorm';
import { ItemsQueryInput } from './dto/items_query_input.dto';
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
   * Get the array of item records with specified parameters.
   * @param {ItemsQueryInput} args - query input fields such as offset, limit.
   * @return {Item[]} item records.
   * @throws {Error} - Internal server error.
   */
  async getItems({ limit, offset }: ItemsQueryInput): Promise<Item[]> {
    const qb = this.itemRepository
      .createQueryBuilder('item')
      .where({
        deletedAt: null,
      })
      .take(limit)
      .skip(offset);

    return qb.getMany().catch((e) => {
      this.logger.error(e);
      throw new Error('Failed to get items.');
    });
  }

  /**
   * Get item records by ids.
   * @throws {Error} sql, db related error.
   */
  public async getItemsByIds(ids: number[]): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .useTransaction(false)
      .where('item.id in (:...ids)', { ids })
      .andWhere('item.deleted_at is null')
      .getMany();
  }

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

import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { QueryRunner } from 'typeorm';
import { PricingRule } from './pricing_rule.model';

@Injectable()
export class PricingRulesService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transaction: TransactionInterface,
  ) {}

  private readonly logger = new Logger(PricingRulesService.name);

  /**
   * Get pricingRule records by customerId with lock.
   * @throws {Error} sql, db related error.
   */
  public async getPricingRulesByCustomerIdWithLock(
    queryRunner: QueryRunner,
    customerId: number,
  ): Promise<PricingRule[]> {
    return queryRunner.manager
      .getRepository(PricingRule)
      .createQueryBuilder('pricingRule')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('pricingRule.customer_id = :customerId', { customerId })
      .andWhere('pricingRule.deleted_at is null')
      .getMany();
  }

  /**
   * Get pricingRule records by ids with lock.
   * @throws {Error} sql, db related error.
   */
  private async getPricingRulesByIdsWithLock(
    queryRunner: QueryRunner,
    ids: number[],
  ): Promise<PricingRule[]> {
    return queryRunner.manager
      .getRepository(PricingRule)
      .createQueryBuilder('pricingRule')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('pricingRule.id in (:...ids)', { ids })
      .andWhere('pricingRule.deleted_at is null')
      .getMany();
  }
}

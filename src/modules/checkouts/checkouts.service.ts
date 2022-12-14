import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTimeUtil } from 'src/common/dateTime/dateTime.util';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { QueryRunner, Repository } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { ItemsService } from '../items/items.service';
import { PricingRulesService } from '../pricing_rules/pricing_rules.service';
import { Checkout, CheckoutStatus } from './checkout.model';
import { CheckoutItem } from './checkouts_items.model';
import {
  CheckoutsOrderBy,
  CheckoutsQueryInput,
} from './dto/checkouts_query_input.dto';
import { CheckoutParamInput } from './dto/checkout_param_input.dto';
import { CreateCheckoutInput } from './dto/create_checkout_input.dto';
import { PayCheckoutInput } from './dto/pay_checkout_input.dto';

@Injectable()
export class CheckoutsService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transaction: TransactionInterface,

    private readonly customerService: CustomersService,
    private readonly pricingRulesService: PricingRulesService,
    private readonly itemsService: ItemsService,

    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(CheckoutItem)
    private readonly checkoutItemRepository: Repository<CheckoutItem>,
  ) {}

  private readonly logger = new Logger(CheckoutsService.name);

  /**
   * Create checkout.
   * @param {CreateCheckoutInput} args - body input fields such as customerName, itemIds
   * @return {Checkout} Checkout record.
   * @throws {HttpException} - Http exception with status code = 400, 404.
   * @throws {Error} - Internal server error.
   */
  async createCheckout({
    customerName,
    itemIdsWithQuantities,
  }: CreateCheckoutInput): Promise<Checkout> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to create checkout.');
      });

    try {
      // Use lock to prevent customer from being deleted by other transactions before this transaction is committed.
      const customer = await this.customerService.getCustomerByNameWithLock(
        queryRunner,
        customerName,
      );

      if (!customer) {
        throw new HttpException('Customer not found.', HttpStatus.NOT_FOUND);
      }

      // Check unique itemIds in itemIdsWithQuantities.
      if (
        itemIdsWithQuantities.length !==
        new Set(itemIdsWithQuantities.map((element) => element.itemId)).size
      ) {
        throw new HttpException(
          'Item ids must be unique.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const items = await this.itemsService.getItemsByIdsWithLock(
        queryRunner,
        itemIdsWithQuantities.map((element) => element.itemId),
      );
      if (items.length !== itemIdsWithQuantities.length) {
        throw new HttpException('Some Items not found.', HttpStatus.NOT_FOUND);
      }

      // Get pricing rules by customer id.
      const pricingRules =
        await this.pricingRulesService.getPricingRulesByCustomerIdWithLock(
          queryRunner,
          customer.id,
        );

      // Flow following the pseudo code of specification.
      const checkout = Checkout.create(customer, pricingRules) as Checkout;
      checkout.batchAdd(
        items.map((item) => {
          return {
            item,
            quantity: itemIdsWithQuantities.find((iq) => iq.itemId === item.id)
              .quantity,
          };
        }),
      );
      checkout.total();

      /**
       * No need to save pricingRules mapping in a seperated joined table,
       * but to fit the pseudo codes of task specification, I save it.
       */
      const checkoutModel = this.checkoutRepository.create(checkout);
      await queryRunner.manager.save(checkoutModel, { reload: true });
      const checkoutItemModels = checkout.checkoutItems.map((checkoutItem) =>
        this.checkoutItemRepository.create({
          ...checkoutItem,
          checkoutId: checkoutModel.id,
        }),
      );
      await queryRunner.manager.save(checkoutItemModels, { reload: true });

      await this.transaction.commit(queryRunner);

      checkoutModel.checkoutItems = checkoutItemModels;
      return checkoutModel;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to create checkout.');
    }
  }

  /**
   * Compute temporary checkout (without saving to database)
   * @param {CreateCheckoutInput} args - body input fields such as customerName, itemIds
   * @return {Checkout} Checkout record.
   * @throws {HttpException} - Http exception with status code = 400, 404.
   * @throws {Error} - Internal server error.
   */
  async computeTemporaryCheckout({
    customerName,
    itemIdsWithQuantities,
  }: CreateCheckoutInput): Promise<Checkout> {
    try {
      const customer = await this.customerService.getCustomerByName(
        customerName,
      );
      if (!customer) {
        throw new HttpException('Customer not found.', HttpStatus.NOT_FOUND);
      }

      // Check unique itemIds in itemIdsWithQuantities.
      if (
        itemIdsWithQuantities.length !==
        new Set(itemIdsWithQuantities.map((element) => element.itemId)).size
      ) {
        throw new HttpException(
          'Item ids must be unique.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const items = await this.itemsService.getItemsByIds(
        itemIdsWithQuantities.map((element) => element.itemId),
      );
      if (items.length !== itemIdsWithQuantities.length) {
        throw new HttpException('Some Items not found.', HttpStatus.NOT_FOUND);
      }

      // Get pricing rules by customer id.
      const pricingRules =
        await this.pricingRulesService.getPricingRulesByCustomerId(customer.id);

      // Flow following the pseudo code of specification.
      const checkout = Checkout.create(customer, pricingRules) as Checkout;
      checkout.batchAdd(
        items.map((item) => {
          return {
            item,
            quantity: itemIdsWithQuantities.find((iq) => iq.itemId === item.id)
              .quantity,
          };
        }),
      );
      checkout.total();

      return checkout;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to create checkout.');
    }
  }

  /**
   * get checkout record.
   * @param {CheckoutParamInput} {id} - id of checkout record.
   * @return {Checkout} Checkout record.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  async getCheckout({ id }: CheckoutParamInput): Promise<Checkout> {
    try {
      const checkout = await this.getCheckoutById(id);
      if (!checkout) {
        throw new HttpException('Checkout not found.', HttpStatus.NOT_FOUND);
      }

      // TODO: handle mismatch previous total and current total when someone deleted or updated some items and pricing rules.
      // This depends on the specific business requirements.

      return checkout;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to get checkout.');
    }
  }

  /**
   * Get the array of checkout records with specified parameters.
   * @param {CheckoutsQueryInput} args - query input fields such as offset, limit, orderBy, asc, ...
   * @return {Checkout[]} Checkout records.
   * @throws {HttpException} - Http exception with status code = 400.
   * @throws {Error} - Internal server error.
   */
  async getCheckouts({
    limit,
    offset,
    orderBy,
    asc,
  }: CheckoutsQueryInput): Promise<Checkout[]> {
    const qb = this.checkoutRepository
      .createQueryBuilder('checkout')
      .innerJoinAndSelect(
        'checkout.customer',
        'customer',
        'customer.deletedAt is null',
      )
      .leftJoinAndSelect('checkout.checkoutItems', 'checkoutItem')
      .leftJoinAndSelect('checkoutItem.item', 'item')
      .leftJoinAndSelect('checkout.pricingRules', 'pricingRule')
      .where({
        deletedAt: null,
      })
      .take(limit)
      .skip(offset);

    // Add order by to query builder.
    switch (orderBy) {
      case CheckoutsOrderBy.createdAt:
        qb.orderBy('checkout.createdAt', asc ? 'ASC' : 'DESC');
        break;
      case CheckoutsOrderBy.confirmedAt:
        qb.orderBy('checkout.confirmedAt', asc ? 'ASC' : 'DESC');
        break;
      default:
        break;
    }

    // TODO: handle mismatch previous total and current total when someone deleted or updated some items and pricing rules.
    // This depends on the specific business requirements.

    return qb.getMany().catch((e) => {
      this.logger.error(e);
      throw new Error('Failed to get checkouts.');
    });
  }

  /**
   * Pay checkout.
   * @param {CheckoutParamInput} {id} - id of checkout record.
   * @param {PayCheckoutInput} args - body input fields such as value.
   * @return {Checkout} Checkout record.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  public async payCheckout(
    { id }: CheckoutParamInput,
    { value }: PayCheckoutInput,
  ): Promise<Checkout> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to pay checkout.');
      });

    try {
      const checkout = await this.getUnpaidCheckoutByIdWithLock(
        queryRunner,
        id,
      );
      if (!checkout) {
        throw new HttpException('Checkout not found.', HttpStatus.NOT_FOUND);
      }
      if (!checkout.totalValue.isEqualTo(value)) {
        throw new HttpException('Invalid value.', HttpStatus.BAD_REQUEST);
      }

      /** Specific payment logic */

      /** End */

      checkout.status = CheckoutStatus.paid;
      checkout.paidAt = DateTimeUtil.getCurrentTime();

      await queryRunner.manager.save(checkout, {
        reload: false,
      });

      await this.transaction.commit(queryRunner);
      return checkout;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to pay checkout.');
    }
  }

  /**
   * Confirm checkout by batch job or admin.
   * @param {CheckoutParamInput} {id} - id of checkout record.
   * @return {Checkout} Checkout record.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  async confirmCheckout({ id }: CheckoutParamInput): Promise<Checkout> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to confirm checkout.');
      });

    try {
      const checkout = await this.getPaidCheckoutByIdWithLock(queryRunner, id);
      if (!checkout) {
        throw new HttpException('Checkout not found.', HttpStatus.NOT_FOUND);
      }

      /** More handling codes for ensuring customer has paid and the checkout data are valid.
       * This depends on the specific business requirements.
       */

      /** End */

      checkout.status = CheckoutStatus.confirmed;
      checkout.confirmedAt = DateTimeUtil.getCurrentTime();

      await queryRunner.manager.save(checkout, {
        reload: false,
      });

      await this.transaction.commit(queryRunner);
      return checkout;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to confirm checkout.');
    }
  }

  /**
   * Cancel checkout by batch job or admin.
   * @param {CheckoutParamInput} {id} - id of checkout record.
   * @return {Checkout} Checkout record.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  async cancelCheckout({ id }: CheckoutParamInput): Promise<Checkout> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to cancel checkout.');
      });

    try {
      const checkout = await this.getUnconfirmedCheckoutByIdWithLock(
        queryRunner,
        id,
      );
      if (!checkout) {
        throw new HttpException('Checkout not found.', HttpStatus.NOT_FOUND);
      }

      checkout.status = CheckoutStatus.cancelled;

      await queryRunner.manager.save(checkout, {
        reload: false,
      });

      await this.transaction.commit(queryRunner);
      return checkout;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to cancel checkout.');
    }
  }

  /**
   * Get a checkout record by its id.
   * @throws {Error} sql, db related error.
   */
  private async getCheckoutById(id: number) {
    return this.checkoutRepository
      .createQueryBuilder('checkout')
      .innerJoinAndSelect(
        'checkout.customer',
        'customer',
        'customer.deletedAt is null',
      )
      .leftJoinAndSelect('checkout.checkoutItems', 'checkoutItem')
      .leftJoinAndSelect('checkoutItem.item', 'item')
      .leftJoinAndSelect('checkout.pricingRules', 'pricingRule')
      .where('checkout.id = :id', { id })
      .andWhere('checkout.deleted_at is null')
      .getOne();
  }

  /**
   * Get a unpaid checkout record by its id with lock.
   * @throws {Error} sql, db related error.
   */
  private async getUnpaidCheckoutByIdWithLock(
    queryRunner: QueryRunner,
    id: number,
  ): Promise<Checkout> {
    return queryRunner.manager
      .getRepository(Checkout)
      .createQueryBuilder('checkout')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('checkout.id = :id', { id })
      .andWhere('checkout.confirmed_at is null and checkout.status = :status', {
        status: CheckoutStatus.unpaid,
      })
      .andWhere('checkout.deleted_at is null')
      .getOne();
  }

  /**
   * Get a paid checkout record by its id with lock.
   * @throws {Error} sql, db related error.
   */
  private async getPaidCheckoutByIdWithLock(
    queryRunner: QueryRunner,
    id: number,
  ): Promise<Checkout> {
    return queryRunner.manager
      .getRepository(Checkout)
      .createQueryBuilder('checkout')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('checkout.id = :id', { id })
      .andWhere('checkout.confirmed_at is null and checkout.status = :status', {
        status: CheckoutStatus.paid,
      })
      .andWhere('checkout.deleted_at is null')
      .getOne();
  }

  /**
   * Get a unconfirmed checkout record by its id with lock.
   * @throws {Error} sql, db related error.
   */
  private async getUnconfirmedCheckoutByIdWithLock(
    queryRunner: QueryRunner,
    id: number,
  ): Promise<Checkout> {
    return queryRunner.manager
      .getRepository(Checkout)
      .createQueryBuilder('checkout')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('checkout.id = :id', { id })
      .andWhere('checkout.confirmed_at is null')
      .andWhere('checkout.deleted_at is null')
      .getOne();
  }
}

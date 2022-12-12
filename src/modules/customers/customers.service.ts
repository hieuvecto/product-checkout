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
import { CreateCustomerInput } from './dto/create_customer_input.dto';
import { CustomersQueryInput } from './dto/customers_query_input.dto';
import { CustomerParamInput } from './dto/customer_param_input.dto';
import { UpdateCustomerInput } from './dto/update_customer_input.dto';
import { Customer } from './customer.model';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transaction: TransactionInterface,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  private readonly logger = new Logger(CustomersService.name);

  /**
   * Create customer.
   * @param {CreateFixtureInput} args - body input fields such as name, displayName, iconImageUrl.
   * @return {Customer} Customer record.
   * @throws {HttpException} - Http exception with status code = 400.
   * @throws {Error} - Internal server error.
   */
  async createCustomer({
    name,
    displayName,
    iconImageUrl,
    type,
  }: CreateCustomerInput): Promise<Customer> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to create customer.');
      });

    try {
      const exitedCustomer = await this.getCustomerByName(name);
      if (exitedCustomer) {
        throw new HttpException(
          'Customer name exited.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const customer = this.customerRepository.create({
        name,
        displayName,
        iconImageUrl,
        type,
      });

      await queryRunner.manager.save(customer, { reload: true });

      await this.transaction.commit(queryRunner);

      return customer;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to create customer.');
    }
  }

  /**
   * Get specific customer record.
   * @param {CustomerParamInput} {name} - name of customer record.
   * @return {Customer} Customer record.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  async getCustomer({ name }: CustomerParamInput): Promise<Customer> {
    const qb = this.customerRepository.createQueryBuilder('customer').where({
      name,
      deletedAt: null,
    });

    try {
      const customer = await qb.getOne();
      if (!customer) {
        throw new HttpException('Customer not found.', HttpStatus.NOT_FOUND);
      }

      return customer;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to get customer.');
    }
  }

  /**
   * Get the array of customer records with specified parameters.
   * @param {CustomersQueryInput} args - query input fields such as offset, limit.
   * @return {Customer[]} Customer records.
   * @throws {Error} - Internal server error.
   */
  async getCustomers({
    limit,
    offset,
  }: CustomersQueryInput): Promise<Customer[]> {
    const qb = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect(
        'customer.pricingRules',
        'pricingRule',
        'pricingRule.deletedAt is null',
      )
      .where({
        deletedAt: null,
      })
      .take(limit)
      .skip(offset);

    return qb.getMany().catch((e) => {
      this.logger.error(e);
      throw new Error('Failed to get customers.');
    });
  }

  /**
   * Update the customer record
   * @param {CustomerParamInput} {name} - name of customer record.
   * @param {UpdateCustomerInput} args - body input fields such as displayName, iconImageUrl.
   * @return {Customer} Customer record.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  async updateCustomer(
    { name }: CustomerParamInput,
    args: UpdateCustomerInput,
  ): Promise<Customer> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to update customer.');
      });

    try {
      const customer = await this.getCustomerByNameWithLock(queryRunner, name);

      if (!customer) {
        throw new HttpException('Customer not found.', HttpStatus.NOT_FOUND);
      }

      customer.displayName = args.displayName ?? customer.displayName;
      customer.iconImageUrl = args.iconImageUrl ?? customer.iconImageUrl;
      customer.type = args.type ?? customer.type;

      await queryRunner.manager.save(customer, { reload: false });

      await this.transaction.commit(queryRunner);

      return customer;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to update customer.');
    }
  }

  /**
   * Set the deleted_at field of customer record to be now()
   * @param {CustomerParamInput} {name} - name of customer record.
   * @return {Boolean}
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
  async deleteCustomer({ name }: CustomerParamInput): Promise<boolean> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to update customer.');
      });

    try {
      const customer = await this.getCustomerByNameWithLock(queryRunner, name);

      if (!customer) {
        throw new HttpException('Customer not found.', HttpStatus.NOT_FOUND);
      }

      customer.deletedAt = DateTimeUtil.getCurrentTime();

      await queryRunner.manager.save(customer, { reload: false });

      await this.transaction.commit(queryRunner);

      return true;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to delete customer.');
    }
  }

  /**
   * Get customer records by ids with lock.
   * @throws {Error} sql, db related error.
   */
  public async getCustomersByIdsWithLock(
    queryRunner: QueryRunner,
    ids: number[],
  ): Promise<Customer[]> {
    return queryRunner.manager
      .getRepository(Customer)
      .createQueryBuilder('customer')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('customer.id in (:...ids)', { ids })
      .andWhere('customer.deleted_at is null')
      .getMany();
  }

  /**
   * Get a customer record by its name.
   * @throws {Error} sql, db related error.
   */
  public async getCustomerByName(name: string): Promise<Customer> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .useTransaction(false)
      .where('customer.name = :name', { name })
      .andWhere('customer.deleted_at is null')
      .getOne();
  }

  /**
   * Get a customer record by its name with lock.
   * @throws {Error} sql, db related error.
   */
  public async getCustomerByNameWithLock(
    queryRunner: QueryRunner,
    name: string,
  ): Promise<Customer> {
    return queryRunner.manager
      .getRepository(Customer)
      .createQueryBuilder('customer')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('customer.name = :name', { name })
      .andWhere('customer.deleted_at is null')
      .getOne();
  }
}

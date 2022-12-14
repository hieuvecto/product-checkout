import { Injectable } from '@nestjs/common';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { Checkout } from 'src/modules/checkouts/checkout.model';
import { CheckoutItem } from 'src/modules/checkouts/checkouts_items.model';
import { Customer } from 'src/modules/customers/customer.model';
import { Item } from 'src/modules/items/item.model';
import { EntityManager, QueryRunner, Repository } from 'typeorm';

class MockEntityManager extends EntityManager {
  constructor(private mockRepositories: Map<string, any>) {
    super(null, null);
    this.mockRepositories = mockRepositories;
  }

  private getMockRepository(entity) {
    if (entity.hasOwnProperty('name') && entity.hasOwnProperty('displayName')) {
      return this.mockRepositories.get('Customer');
    } else if (
      entity.hasOwnProperty('price') &&
      entity.hasOwnProperty('title') &&
      entity.hasOwnProperty('description')
    ) {
      return this.mockRepositories.get('Item');
    } else if (
      entity.hasOwnProperty('subTotalValue') &&
      entity.hasOwnProperty('totalValue')
    ) {
      return this.mockRepositories.get('Checkout');
    } else if (
      entity.hasOwnProperty('itemId') &&
      entity.hasOwnProperty('quantity')
    ) {
      return this.mockRepositories.get('CheckoutItem');
    }

    return null;
  }

  private _save(entity) {
    const r = this.getMockRepository(entity);
    if (r) {
      r.save(entity);
    }
  }

  async save(entity) {
    if (Array.isArray(entity)) {
      entity.forEach((e) => this._save(e));
    } else {
      this._save(entity);
    }
    return null;
  }

  async findOne(targetClass, args) {
    const r = this.mockRepositories.get(targetClass.name);
    if (r) {
      return r.findOne(args);
    }
    return null;
  }

  async update(targetClass, key, entity) {
    const r = this.mockRepositories.get(targetClass.name);
    if (r) {
      r.save(entity);
    }
    return null;
  }
}

export class MockQueryRunner {
  manager = null;
  constructor(mockRepositories: Map<any, any>) {
    this.manager = new MockEntityManager(mockRepositories);
  }
}

/**
 * Generate a QueryRunner that uses the repository for testing
 */
@Injectable()
export class MockTransactionService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(CheckoutItem)
    private readonly checkoutItemRepository: Repository<CheckoutItem>,
  ) {}

  static NullRepositories = [
    { provide: getRepositoryToken(Customer), useValue: null },
    { provide: getRepositoryToken(Item), useValue: null },
    { provide: getRepositoryToken(Checkout), useValue: null },
    { provide: getRepositoryToken(CheckoutItem), useValue: null },
  ];

  startTransaction = jest.fn(async (): Promise<QueryRunner> => {
    const mockRepositories = new Map<string, any>();
    mockRepositories.set('Customer', this.customerRepository);
    mockRepositories.set('Item', this.itemRepository);
    mockRepositories.set('Checkout', this.checkoutRepository);
    mockRepositories.set('CheckoutItem', this.checkoutItemRepository);
    const queryRunner = new MockQueryRunner(mockRepositories) as QueryRunner;
    (<any>queryRunner).isTransactionActive = true;
    return queryRunner;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  commit = jest.fn(async (queryRunner: QueryRunner): Promise<void> => {
    return;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rollback = jest.fn(async (queryRunner: QueryRunner): Promise<void> => {
    return;
  });
}

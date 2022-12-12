import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { Repository } from 'typeorm';
import { MockTransactionService } from '../../common/transaction/mockTransaction.service';
import configuration from '../../config/configuration';
import { Customer } from '../customers/customer.model';
import { CustomersService } from '../customers/customers.service';
import { Item } from '../items/item.model';
import { ItemsService } from '../items/items.service';
import {
  PricingRule,
  PricingRuleType,
} from '../pricing_rules/pricing_rule.model';
import { PricingRulesService } from '../pricing_rules/pricing_rules.service';
import { Checkout } from './checkout.model';
import { CheckoutsService } from './checkouts.service';
import { CheckoutItem } from './checkouts_items.model';
import { CreateCheckoutInput } from './dto/create_checkout_input.dto';

describe('CheckoutsService', () => {
  let service: CheckoutsService;
  let customerService: CustomersService;
  let pricingRulesService: PricingRulesService;
  let itemsService: ItemsService;

  const mockCheckoutRepo = new Repository<Checkout>();
  const mockCheckoutItemRepo = new Repository<CheckoutItem>();
  const mockPricingRuleRepo = new Repository<PricingRule>();

  // Copy from json.
  const validBaseCheckout = {
    status: 'unpaid',
    id: 1,
    createdAt: '2022-12-11T06:28:44.735Z',
    updatedAt: '2022-12-11T06:28:44.735Z',
    deletedAt: null,
    customerId: 3,
    subTotalValue: new BigNumber('10593'),
    totalValue: new BigNumber('9194'),
    paidAt: null,
    confirmedAt: null,
    customer: {
      type: 'privileged',
      id: 3,
      createdAt: '2022-12-11T02:19:51.781Z',
      updatedAt: '2022-12-11T02:19:51.781Z',
      deletedAt: null,
      name: 'amazon',
      displayName: 'Amazon',
      iconImageUrl: 'https://znews-stc.zdn.vn/static/topic/company/amazon.png',
    },
    checkoutItems: [
      {
        id: 18,
        createdAt: '2022-12-11T06:28:44.793Z',
        updatedAt: '2022-12-11T06:28:44.793Z',
        deletedAt: null,
        checkoutId: 9,
        itemId: 1,
        quantity: 3,
        item: {
          id: 1,
          createdAt: '2022-12-11T02:26:38.815Z',
          updatedAt: '2022-12-11T02:27:09.195Z',
          deletedAt: null,
          title: 'Small Pizza',
          description: "10'' Pizza for two persons",
          price: new BigNumber('1199'),
        },
      },
      {
        id: 19,
        createdAt: '2022-12-11T06:28:44.793Z',
        updatedAt: '2022-12-11T06:28:44.793Z',
        deletedAt: null,
        checkoutId: 9,
        itemId: 2,
        quantity: 3,
        item: {
          id: 2,
          createdAt: '2022-12-11T02:26:38.815Z',
          updatedAt: '2022-12-11T02:27:09.195Z',
          deletedAt: null,
          title: 'Medium Pizza',
          description: "12'' Pizza for two persons",
          price: new BigNumber('1599'),
        },
      },
      {
        id: 20,
        createdAt: '2022-12-11T06:28:44.803Z',
        updatedAt: '2022-12-11T06:28:44.803Z',
        deletedAt: null,
        checkoutId: 9,
        itemId: 3,
        quantity: 1,
        item: {
          id: 3,
          createdAt: '2022-12-11T02:27:36.557Z',
          updatedAt: '2022-12-11T02:27:36.557Z',
          deletedAt: null,
          title: 'Large Pizza',
          description: "15'' Pizza for four persons",
          price: new BigNumber('2199'),
        },
      },
    ],
    pricingRules: [
      {
        customerId: 3,
        itemId: 3,
        type: PricingRuleType.discount,
        discountPrice: new BigNumber('1999'),
      },
      {
        customerId: 3,
        itemId: 1,
        type: PricingRuleType.deal,
        fromQuantity: 3,
        toQuantity: 2,
      },
    ],
  };

  const customerRecords = [
    {
      type: 'default',
      id: 1,
      createdAt: '2022-12-11T02:19:51.781Z',
      updatedAt: '2022-12-11T02:19:51.781Z',
      deletedAt: null,
      name: 'default',
      displayName: 'default',
      iconImageUrl: 'https://znews-stc.zdn.vn/static/topic/company/amazon.png',
    },
    {
      type: 'privileged',
      id: 2,
      createdAt: '2022-12-11T02:19:51.781Z',
      updatedAt: '2022-12-11T02:19:51.781Z',
      deletedAt: null,
      name: 'microsoft',
      displayName: 'Microsoft',
      iconImageUrl: 'https://znews-stc.zdn.vn/static/topic/company/amazon.png',
    },
    {
      type: 'privileged',
      id: 3,
      createdAt: '2022-12-11T02:19:51.781Z',
      updatedAt: '2022-12-11T02:19:51.781Z',
      deletedAt: null,
      name: 'amazon',
      displayName: 'Amazon',
      iconImageUrl: 'https://znews-stc.zdn.vn/static/topic/company/amazon.png',
    },
    {
      type: 'privileged',
      id: 4,
      createdAt: '2022-12-11T02:19:51.781Z',
      updatedAt: '2022-12-11T02:19:51.781Z',
      deletedAt: null,
      name: 'facebook',
      displayName: 'Facebook',
      iconImageUrl: 'https://znews-stc.zdn.vn/static/topic/company/amazon.png',
    },
  ];
  const itemRecords = [
    {
      id: 1,
      createdAt: '2022-12-11T02:26:38.815Z',
      updatedAt: '2022-12-11T02:27:09.195Z',
      deletedAt: null,
      title: 'Small Pizza',
      description: "10'' Pizza for two persons",
      price: new BigNumber('1199'),
    },
    {
      id: 2,
      createdAt: '2022-12-11T02:26:38.815Z',
      updatedAt: '2022-12-11T02:27:09.195Z',
      deletedAt: null,
      title: 'Medium Pizza',
      description: "12'' Pizza for two persons",
      price: new BigNumber('1599'),
    },
    {
      id: 3,
      createdAt: '2022-12-11T02:27:36.557Z',
      updatedAt: '2022-12-11T02:27:36.557Z',
      deletedAt: null,
      title: 'Large Pizza',
      description: "15'' Pizza for four persons",
      price: new BigNumber('2199'),
    },
  ];
  const pricingRuleRecords = [
    {
      customerId: 2,
      itemId: 1,
      type: PricingRuleType.deal,
      fromQuantity: 3,
      toQuantity: 2,
    },
    {
      customerId: 3,
      itemId: 3,
      type: PricingRuleType.discount,
      discountPrice: new BigNumber('1999'),
    },
    {
      customerId: 3,
      itemId: 1,
      type: PricingRuleType.deal,
      fromQuantity: 3,
      toQuantity: 2,
    },
    {
      customerId: 4,
      itemId: 1,
      type: PricingRuleType.deal,
      fromQuantity: 5,
      toQuantity: 4,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutsService,
        CustomersService,
        PricingRulesService,
        ItemsService,
        { provide: 'TransactionInterface', useClass: MockTransactionService },
        ...MockTransactionService.NullRepositories,
        {
          provide: getRepositoryToken(Checkout),
          useValue: mockCheckoutRepo,
        },
        {
          provide: getRepositoryToken(CheckoutItem),
          useValue: mockCheckoutItemRepo,
        },
        {
          provide: getRepositoryToken(PricingRule),
          useValue: mockPricingRuleRepo,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.development',
          load: [configuration],
          isGlobal: true,
        }),
      ],
    }).compile();

    service = module.get<CheckoutsService>(CheckoutsService);
    customerService = module.get<CustomersService>(CustomersService);
    pricingRulesService = module.get<PricingRulesService>(PricingRulesService);
    itemsService = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('success: createCheckout', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'amazon';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 3 },
      { itemId: 2, quantity: 3 },
      { itemId: 3, quantity: 1 },
    ];

    return service.createCheckout(dto).then((checkout) => {
      expect(checkout.id).toEqual(1);
      expect(checkout.subTotalValue.isEqualTo('10593')).toBeTruthy();
      expect(checkout.totalValue.isEqualTo('9194')).toBeTruthy();
      expect(mockCheckoutRepo.create).toBeCalled();
      expect(mockCheckoutRepo.save).toBeCalled();
      expect(mockCheckoutItemRepo.create).toBeCalled();
      expect(mockCheckoutItemRepo.save).toBeCalled();
      expect((<any>service).transaction.startTransaction).toBeCalled();
      expect((<any>service).transaction.commit).toBeCalled();
      expect((<any>service).transaction.rollback).not.toBeCalled();
    });
  });

  it('success: createCheckout case 1 - Default: Small Pizza x1 + Medium Pizza x1 +  Large Pizza x1', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'default';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 1 },
      { itemId: 2, quantity: 1 },
      { itemId: 3, quantity: 1 },
    ];
  });

  it('success: createCheckout case 2 - Microsoft: Small Pizza x3 +  Large Pizza x1', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'microsoft';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 3 },
      { itemId: 3, quantity: 1 },
    ];

    return service.createCheckout(dto).then((checkout) => {
      expect(checkout.id).toEqual(1);
      expect(checkout.subTotalValue.isEqualTo('5796')).toBeTruthy();
      expect(checkout.totalValue.isEqualTo('4597')).toBeTruthy();
      expect(mockCheckoutRepo.create).toBeCalled();
      expect(mockCheckoutRepo.save).toBeCalled();
      expect(mockCheckoutItemRepo.create).toBeCalled();
      expect(mockCheckoutItemRepo.save).toBeCalled();
      expect((<any>service).transaction.startTransaction).toBeCalled();
      expect((<any>service).transaction.commit).toBeCalled();
      expect((<any>service).transaction.rollback).not.toBeCalled();
    });
  });

  it('success: createCheckout case 3 - Amazon: Medium Pizza x3 +  Large Pizza x1', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'amazon';
    dto.itemIdsWithQuantities = [
      { itemId: 2, quantity: 3 },
      { itemId: 3, quantity: 1 },
    ];

    return service.createCheckout(dto).then((checkout) => {
      expect(checkout.id).toEqual(1);
      expect(checkout.subTotalValue.isEqualTo('6996')).toBeTruthy();
      expect(checkout.totalValue.isEqualTo('6796')).toBeTruthy();
      expect(mockCheckoutRepo.create).toBeCalled();
      expect(mockCheckoutRepo.save).toBeCalled();
      expect(mockCheckoutItemRepo.create).toBeCalled();
      expect(mockCheckoutItemRepo.save).toBeCalled();
      expect((<any>service).transaction.startTransaction).toBeCalled();
      expect((<any>service).transaction.commit).toBeCalled();
      expect((<any>service).transaction.rollback).not.toBeCalled();
    });
  });

  it('fail: createCheckout - customer not found.', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'amazon-123';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 3 },
      { itemId: 2, quantity: 3 },
      { itemId: 3, quantity: 1 },
    ];

    return service
      .createCheckout(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect((<any>itemsService).getItemsByIdsWithLock).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('fail: createCheckout - item ids are not unique.', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'amazon';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 3 },
      { itemId: 1, quantity: 3 },
      { itemId: 3, quantity: 1 },
    ];

    return service
      .createCheckout(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        expect((<any>itemsService).getItemsByIdsWithLock).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('fail: createCheckout - Some Items not found.', () => {
    jest
      .spyOn(<any>customerService, 'getCustomerByNameWithLock')
      .mockImplementation((queryRunner: any, name: string) =>
        Promise.resolve(
          customerRecords.find(
            (customer) => customer.name === name,
          ) as unknown as Customer,
        ),
      );
    jest
      .spyOn(<any>itemsService, 'getItemsByIdsWithLock')
      .mockImplementation((queryRunner: any, ids: number[]) =>
        Promise.resolve(
          itemRecords.filter((item) =>
            ids.includes(item.id),
          ) as unknown as Item[],
        ),
      );
    jest
      .spyOn(<any>pricingRulesService, 'getPricingRulesByCustomerIdWithLock')
      .mockImplementation((queryRunner: any, customerId: number) =>
        Promise.resolve(
          pricingRuleRecords.filter(
            (pr) => pr.customerId === customerId,
          ) as unknown as PricingRule[],
        ),
      );

    jest
      .spyOn(mockCheckoutRepo, 'create')
      .mockImplementation((model: any) => model as Checkout);
    jest.spyOn(mockCheckoutRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });
    jest
      .spyOn(mockCheckoutItemRepo, 'create')
      .mockImplementation((model: any) => model as CheckoutItem);
    jest
      .spyOn(mockCheckoutItemRepo, 'save')
      .mockImplementation((model: any) => {
        model.id = 1;
        return model;
      });

    const dto = new CreateCheckoutInput();
    dto.customerName = 'amazon';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 3 },
      { itemId: 5, quantity: 3 },
      { itemId: 3, quantity: 1 },
    ];

    return service
      .createCheckout(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect((<any>itemsService).getItemsByIdsWithLock).toBeCalled();
        expect(
          (<any>pricingRulesService).getPricingRulesByCustomerIdWithLock,
        ).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });
});

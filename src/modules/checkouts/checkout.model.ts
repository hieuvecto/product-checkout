import { ApiProperty } from '@nestjs/swagger';
import BigNumber from 'bignumber.js';
import { dollarValueFeeColumnOptions } from 'src/common/typeorm_columns_option/columnOptions';
import {
  Entity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Customer } from '../customers/customer.model';
import { Item } from '../items/item.model';
import { PricingRule } from '../pricing_rules/pricing_rule.model';
import {
  CheckoutInterface,
  CheckoutInterfaceWithConstructor,
} from './checkout.model.interface';

export enum CheckoutStatus {
  unpaid = 'unpaid',
  paid = 'paid',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

@Entity()
export class Checkout implements CheckoutInterface {
  constructor(pricingRules: PricingRule[]) {
    if (pricingRules.length === 0) {
      throw new Error('pricingRules must not be empty');
    }

    this.pricingRules = pricingRules;
    // check if this.pricingRules are all from the same customer
    if (
      !this.pricingRules.every(
        (rule) => rule.customerId === this.pricingRules[0].customerId,
      )
    ) {
      throw new Error('pricingRules must be from the same customer');
    }
  }

  static create(
    constructor: CheckoutInterfaceWithConstructor,
    pricingRules: PricingRule[],
  ): CheckoutInterface {
    return new constructor(pricingRules);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @CreateDateColumn()
  @Index()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  @Index()
  readonly updatedAt?: Date;

  @Column({ nullable: true })
  @Index()
  public deletedAt: Date | null;

  @Column()
  readonly customerId: number;

  @ManyToOne((type) => Customer, (customer) => customer.checkouts)
  readonly customer: Customer;

  @Column(dollarValueFeeColumnOptions)
  @Index()
  public totalValue: BigNumber;

  @ManyToMany((type) => Item, (item) => item.checkouts)
  @JoinTable()
  public items: Item[];

  @ManyToMany((type) => PricingRule, (rule) => rule.checkouts)
  @JoinTable()
  readonly pricingRules: PricingRule[];

  @Column({
    type: 'enum',
    enum: CheckoutStatus,
    default: CheckoutStatus.unpaid,
  })
  @Index()
  public status: CheckoutStatus = CheckoutStatus.unpaid;

  @Column({ nullable: true })
  @Index()
  public paidAt: Date | null;

  @Column({ nullable: true })
  @Index()
  public confirmedAt: Date | null;

  public add(item: Item): void {
    if (!this.items) {
      this.items = [item];
    } else {
      this.items.push(item);
    }
  }

  public total(): void {
    // TODO: Implement total calculation with pricing rules
    this.totalValue = this.items.reduce(
      (pre, cur) => pre.plus(cur.value),
      BigNumber(0),
    );
  }

  public batchAdd(items: Item[]): void {
    if (!this.items) {
      this.items = items;
    } else {
      this.items = this.items.concat(items);
    }
  }
}

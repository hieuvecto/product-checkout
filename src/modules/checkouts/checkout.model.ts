import { ApiProperty } from '@nestjs/swagger';
import BigNumber from 'bignumber.js';
import { centValueFeeColumnOptions } from 'src/common/typeorm_columns_option/columnOptions';
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
import { CheckoutInterface } from './checkout.model.interface';

export enum CheckoutStatus {
  unpaid = 'unpaid',
  paid = 'paid',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

@Entity()
export class Checkout implements CheckoutInterface {
  /**
   * Cannot overriding the constructor (If so, break the framework flow). Thus make static function instead.
   * I think the pseudo codes maybe not restricted, therefore i add customerId as an extra parameter.
   */
  static create(
    customerId: number,
    pricingRules: PricingRule[],
  ): CheckoutInterface {
    // check if pricingRules are all from the same customer
    if (
      pricingRules.length > 0 &&
      !pricingRules.every((rule) => rule.customerId === customerId)
    ) {
      throw new Error('pricingRules must be from the same customer');
    }

    const checkout = new Checkout();
    (<any>checkout.pricingRules) = pricingRules;
    (<any>checkout.customerId) = customerId;

    return checkout;
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

  @Column(centValueFeeColumnOptions)
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

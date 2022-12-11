import BigNumber from 'bignumber.js';
import { centValueFeeColumnOptions } from 'src/common/typeorm_columns_option/columnOptions';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Checkout } from '../checkouts/checkout.model';
import { Customer } from '../customers/customer.model';
import { Item } from '../items/item.model';

export enum PricingRuleType {
  deal = 'deal',
  discount = 'discount',
}

@Entity()
export class PricingRule {
  @PrimaryGeneratedColumn('increment')
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

  @ManyToOne((type) => Customer, (customer) => customer.pricingRules)
  readonly customer: Customer;

  @Column()
  readonly itemId: number;

  @ManyToOne((type) => Item, (item) => item.pricingRules)
  readonly item: Item;

  @Column({
    type: 'enum',
    enum: PricingRuleType,
  })
  readonly type: PricingRuleType;

  /** Deal pricing rule */
  @Column({ nullable: true })
  public fromQuantity?: number | null;

  @Column({ nullable: true })
  public toQuantity?: number | null;
  /** End of deal pricing rule */

  /** Discount pricing rule */
  @Column(centValueFeeColumnOptions)
  @Index()
  public discountValue?: BigNumber | null;
  /** End of discount pricing rule */

  @ManyToMany((type) => Checkout, (checkout) => checkout.pricingRules)
  readonly checkouts: Checkout[];
}

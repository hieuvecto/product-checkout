import BigNumber from 'bignumber.js';
import { dollarValueFeeColumnOptions } from 'src/common/typeorm_columns_option/columnOptions';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Customer } from '../customers/customer.model';
import { Item } from '../items/item.model';
import { IPricingRule } from '../pricing_rules/pricing_rule.model.interface';

@Entity()
export class DiscountPricingRule implements IPricingRule {
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

  @ManyToOne((type) => Customer, (customer) => customer.discountPricingRules)
  readonly customer: Customer;

  @Column()
  readonly itemId: number;

  @ManyToOne((type) => Item, (item) => item.discountPricingRules)
  readonly item: Item;

  @Column(dollarValueFeeColumnOptions)
  @Index()
  public discountValue: BigNumber;
}

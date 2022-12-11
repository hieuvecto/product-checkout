import { ApiProperty } from '@nestjs/swagger';
import BigNumber from 'bignumber.js';
import {
  centValueFeeColumnOptions,
  nullableCentValueFeeColumnOptions,
} from 'src/common/typeorm_columns_option/columnOptions';
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
  @ApiProperty()
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

  @ApiProperty()
  @Column()
  readonly customerId: number;

  @ManyToOne((type) => Customer, (customer) => customer.pricingRules)
  readonly customer: Customer;

  @ApiProperty()
  @Column()
  readonly itemId: number;

  @ManyToOne((type) => Item, (item) => item.pricingRules)
  readonly item: Item;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PricingRuleType,
  })
  readonly type: PricingRuleType;

  /** Deal pricing rule */
  @ApiProperty()
  @Column({ nullable: true })
  public fromQuantity?: number | null;

  @ApiProperty()
  @Column({ nullable: true })
  public toQuantity?: number | null;
  /** End of deal pricing rule */

  /** Discount pricing rule */
  @ApiProperty()
  @Column(nullableCentValueFeeColumnOptions)
  public discountPrice?: BigNumber | null;
  /** End of discount pricing rule */

  @ManyToMany((type) => Checkout, (checkout) => checkout.pricingRules)
  readonly checkouts: Checkout[];
}

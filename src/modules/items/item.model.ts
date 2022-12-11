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
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { CheckoutItem } from '../checkouts/checkouts_items.model';
import { PricingRule } from '../pricing_rules/pricing_rule.model';

@Entity()
export class Item {
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

  @ApiProperty()
  @Column({ length: 32, collation: 'utf8mb4_unicode_ci' })
  public title: string;

  @ApiProperty()
  @Column({ length: 4096, nullable: true, collation: 'utf8mb4_unicode_ci' })
  public description: string | null;

  @ApiProperty({
    description: 'The retail price of the item (cent unit)',
    example: '"1000"',
  })
  @Column(centValueFeeColumnOptions)
  @Index()
  public price: BigNumber;

  // TODO: handle the remaining amount of items

  @OneToMany((type) => PricingRule, (rule) => rule.item)
  readonly pricingRules: PricingRule[];

  @OneToMany((type) => CheckoutItem, (checkoutItem) => checkoutItem.item)
  readonly checkoutItems: CheckoutItem[];
}

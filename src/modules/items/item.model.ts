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
  OneToMany,
} from 'typeorm';
import { DealPricingRule } from '../deal_pricing_rules/deal_pricing_rule.model';
import { DiscountPricingRule } from '../discount_pricing_rules/discount_pricing_rule.model';

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
  @Column({ length: 32 })
  @Index({ unique: true })
  public name: string;

  @ApiProperty()
  @Column({ length: 32, collation: 'utf8mb4_unicode_ci' })
  public displayName: string;

  @ApiProperty()
  @Column({ length: 4096, nullable: true, collation: 'utf8mb4_unicode_ci' })
  public description: string | null;

  @Column(dollarValueFeeColumnOptions)
  @Index()
  public value: BigNumber;

  @OneToMany((type) => DealPricingRule, (rule) => rule.item)
  readonly dealPricingRules: DealPricingRule[];

  @OneToMany((type) => DiscountPricingRule, (rule) => rule.item)
  readonly discountPricingRules: DiscountPricingRule[];
}

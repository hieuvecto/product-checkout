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
  ManyToMany,
} from 'typeorm';
import { Checkout } from '../checkouts/checkout.model';
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

  @Column(dollarValueFeeColumnOptions)
  @Index()
  public value: BigNumber;

  @OneToMany((type) => PricingRule, (rule) => rule.item)
  readonly pricingRules: PricingRule[];

  @ManyToMany((type) => Checkout, (checkout) => checkout.items)
  public checkouts: Checkout[];
}

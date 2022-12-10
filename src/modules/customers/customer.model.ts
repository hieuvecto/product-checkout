import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Checkout } from '../checkouts/checkout.model';
import { PricingRule } from '../pricing_rules/pricing_rule.model';

@Entity()
export class Customer {
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
  @Column({ nullable: true })
  public iconImageUrl: string | null;

  @OneToMany((type) => PricingRule, (rule) => rule.customer)
  readonly pricingRules: PricingRule[];

  @OneToMany((type) => Checkout, (checkout) => checkout.customer)
  readonly checkouts: Checkout[];
}

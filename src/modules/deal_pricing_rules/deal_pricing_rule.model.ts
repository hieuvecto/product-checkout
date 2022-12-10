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
export class DealPricingRule implements IPricingRule {
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

  @ManyToOne((type) => Customer, (customer) => customer.dealPricingRules)
  readonly customer: Customer;

  @Column()
  readonly itemId: number;

  @ManyToOne((type) => Item, (item) => item.dealPricingRules)
  readonly item: Item;

  @Column()
  public fromQuantity: number;

  @Column()
  public toQuantity: number;
}

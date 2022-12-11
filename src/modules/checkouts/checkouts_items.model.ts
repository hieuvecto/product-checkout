import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Item } from '../items/item.model';
import { Checkout } from './checkout.model';

export enum CheckoutStatus {
  unpaid = 'unpaid',
  paid = 'paid',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

/**
 * The joined table between checkouts and items tables.
 */
@Entity()
export class CheckoutItem {
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
  readonly checkoutId: number;

  @ManyToOne((type) => Checkout, (checkout) => checkout.checkoutItems)
  readonly checkout: Checkout;

  @Column()
  readonly itemId: number;

  @ManyToOne((type) => Item, (item) => item.checkoutItems)
  readonly item: Item;

  @Column()
  public quantity: number;
}

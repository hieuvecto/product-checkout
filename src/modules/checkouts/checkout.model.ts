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
  OneToMany,
} from 'typeorm';
import { Customer } from '../customers/customer.model';
import { Item } from '../items/item.model';
import {
  PricingRule,
  PricingRuleType,
} from '../pricing_rules/pricing_rule.model';
import {
  CheckoutInterface,
  ItemWithQuantity,
} from './checkout.model.interface';
import { CheckoutItem } from './checkouts_items.model';

export enum CheckoutStatus {
  unpaid = 'unpaid',
  paid = 'paid',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

type ProcessingCheckoutItem = Pick<
  CheckoutItem,
  'itemId' | 'item' | 'quantity'
> & { totalValue: BigNumber; discountedValue?: BigNumber };

@Entity()
export class Checkout implements CheckoutInterface {
  /**
   * Cannot overriding the constructor (If so, break the framework flow). Thus make static function instead.
   * I think the pseudo codes maybe not restricted, therefore i add customerId as an extra parameter.
   */
  static create(
    customer: Customer,
    pricingRules: PricingRule[],
  ): CheckoutInterface {
    // check if pricingRules are all from the same customer
    if (
      pricingRules.length > 0 &&
      !pricingRules.every((rule) => rule.customerId === customer.id)
    ) {
      throw new Error('pricingRules must be from the same customer');
    }

    const checkout = new Checkout();
    (<any>checkout.pricingRules) = pricingRules;
    (<any>checkout.customer) = customer;

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

  @ApiProperty()
  @Column()
  readonly customerId: number;

  @ManyToOne((type) => Customer, (customer) => customer.checkouts)
  readonly customer: Customer;

  @ApiProperty({
    description: 'The value before applying the pricing rules (Cent unit ¢)',
  })
  @Column(centValueFeeColumnOptions)
  @Index()
  public totalValue: BigNumber;

  @ApiProperty({
    description: 'The value after applying the pricing rules (Cent unit ¢)',
  })
  @Column(centValueFeeColumnOptions)
  @Index()
  public discountedValue: BigNumber;

  @ManyToMany((type) => PricingRule, (rule) => rule.checkouts)
  @JoinTable()
  readonly pricingRules: PricingRule[];

  @ApiProperty({ enum: [...Object.values(CheckoutStatus)] })
  @Column({
    type: 'enum',
    enum: CheckoutStatus,
    default: CheckoutStatus.unpaid,
  })
  @Index()
  public status: CheckoutStatus = CheckoutStatus.unpaid;

  @ApiProperty()
  @Column({ nullable: true })
  @Index()
  public paidAt: Date | null;

  @ApiProperty()
  @Column({ nullable: true })
  @Index()
  public confirmedAt: Date | null;

  // TODO: add more columns such as expiredAt, cancelledAt, etc.

  @OneToMany((type) => CheckoutItem, (checkoutItem) => checkoutItem.checkout)
  public checkoutItems: CheckoutItem[];

  public add(item: Item): void {
    if (!this.checkoutItems) {
      this.checkoutItems = [
        { itemId: item.id, item, quantity: 1 } as CheckoutItem,
      ];
    } else {
      const foundCheckoutsItems = this.checkoutItems.find(
        (ci) => ci.itemId === item.id,
      );
      if (foundCheckoutsItems) {
        foundCheckoutsItems.quantity += 1;
      } else {
        this.checkoutItems.push({
          itemId: item.id,
          item,
          quantity: 1,
        } as CheckoutItem);
      }
    }
  }

  public total(): void {
    // clone checkoutItems to avoid changing the original data
    const clonedCheckoutItems: ProcessingCheckoutItem[] =
      this.checkoutItems.map((ci) => {
        if (!ci.item || !ci.quantity) {
          throw new Error('CheckoutItem is not valid');
        }
        return {
          ...ci,
          totalValue: ci.item.price.multipliedBy(ci.quantity),
        } as ProcessingCheckoutItem;
      });
    for (const pr of this.pricingRules) {
      // find affected checkout item
      const affectedCheckoutItem = clonedCheckoutItems.find(
        (ci) => ci.itemId === pr.itemId,
      );
      if (!affectedCheckoutItem) {
        continue;
      }

      // apply pricing rule
      // TODO: add extra columns in the checkouts_pricing_rules table to store the detail of applied rules
      switch (pr.type) {
        case PricingRuleType.deal: {
          if (!pr.fromQuantity || !pr.toQuantity) {
            throw new Error('Dealing pricing rule is not valid');
          }
          const dealQuantityTimes = Math.floor(
            affectedCheckoutItem.quantity / pr.fromQuantity,
          );
          const remainingQuantity =
            affectedCheckoutItem.quantity % pr.fromQuantity;

          affectedCheckoutItem.discountedValue =
            affectedCheckoutItem.item.price.multipliedBy(
              dealQuantityTimes * pr.toQuantity + remainingQuantity,
            );
          break;
        }
        case PricingRuleType.discount: {
          if (!pr.discountPrice) {
            throw new Error('Discount pricing rule is not valid');
          }
          affectedCheckoutItem.discountedValue = pr.discountPrice.multipliedBy(
            affectedCheckoutItem.quantity,
          );
          break;
        }
        default:
          throw new Error('PricingRuleType is not valid');
      }
    }

    // calculate total value
    this.totalValue = clonedCheckoutItems.reduce<BigNumber>((prev, cur) => {
      return prev.plus(cur.totalValue);
    }, new BigNumber(0));
    // calculate discounted value
    this.discountedValue = clonedCheckoutItems.reduce<BigNumber>(
      (prev, cur) => {
        return prev.plus(cur.discountedValue || cur.totalValue);
      },
      new BigNumber(0),
    );
  }

  public batchAdd(itemsWithQuantities: ItemWithQuantity[]): void {
    if (!this.checkoutItems) {
      this.checkoutItems = [
        ...itemsWithQuantities.map<CheckoutItem>((iq) => {
          return {
            itemId: iq.item.id,
            item: iq.item,
            quantity: iq.quantity,
          } as CheckoutItem;
        }),
      ];
    } else {
      // add quantity to existing checkout item
      for (const iq of itemsWithQuantities) {
        const foundCheckoutsItems = this.checkoutItems.find(
          (ci) => ci.itemId === iq.item.id,
        );
        if (foundCheckoutsItems) {
          foundCheckoutsItems.quantity += iq.quantity;
        } else {
          this.checkoutItems.push({
            itemId: iq.item.id,
            item: iq.item,
            quantity: iq.quantity,
          } as CheckoutItem);
        }
      }
    }
  }
}

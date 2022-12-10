import { Customer } from '../customers/customer.model';
import { Item } from '../items/item.model';

export interface IPricingRule {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
  customerId: number;
  customer: Customer;
  itemId: number;
  item: Item;
}

import { Item } from '../items/item.model';
import { PricingRule } from '../pricing_rules/pricing_rule.model';

export interface ItemWithQuantity {
  item: Item;
  quantity: number;
}
export interface CheckoutInterface {
  add(item: Item): void;
  batchAdd(itemsWithQuantities: ItemWithQuantity[]): void;
  total(): void;
}

import { Item } from '../items/item.model';
import { PricingRule } from '../pricing_rules/pricing_rule.model';

export interface CheckoutInterface {
  add(item: Item): void;
  batchAdd(items: Item[]): void;
  total(): void;
}

export interface CheckoutInterfaceWithConstructor {
  new (pricingRules: PricingRule[]): CheckoutInterface;
}

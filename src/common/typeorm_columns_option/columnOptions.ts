import { ColumnOptions } from 'typeorm';
import {
  getNotNaNBigNumber,
  getNotNaNString,
} from '../scalars/unsigned_big_number.scalar';

export const dollarValueFeeColumnOptions: ColumnOptions = {
  type: 'decimal',
  precision: 36,
  scale: 2,
  transformer: {
    from: (v) => getNotNaNBigNumber(v),
    to: (v) => getNotNaNString(v),
  },
  nullable: true,
};

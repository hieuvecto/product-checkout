import { ColumnOptions } from 'typeorm';
import {
  getNotNaNBigNumber,
  getNotNaNString,
} from '../scalars/unsigned_big_number.scalar';

export const centValueFeeColumnOptions: ColumnOptions = {
  type: 'decimal',
  precision: 16,
  scale: 0,
  transformer: {
    from: (v) => getNotNaNBigNumber(v),
    to: (v) => getNotNaNString(v),
  },
};

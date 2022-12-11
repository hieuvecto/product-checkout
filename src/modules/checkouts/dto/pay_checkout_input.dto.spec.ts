import BigNumber from 'bignumber.js';
import { validate } from 'class-validator';
import parseISO from 'date-fns/parseISO';
import { DateTimeUtil } from 'src/common/dateTime/dateTime.util';
import { CreateCheckoutInput } from './create_checkout_input.dto';
import { PayCheckoutInput } from './pay_checkout_input.dto';

describe('CreateFixtureInput', () => {
  it('validate', () => {
    const dto = new PayCheckoutInput();
    dto.value = new BigNumber(7196);

    return validate(dto)
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.value = new BigNumber('abcdef');
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.value = new BigNumber('7196');
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      });
  });
});

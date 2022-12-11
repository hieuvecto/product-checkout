import { validate } from 'class-validator';
import { CheckoutParamInput } from './checkout_param_input.dto';

describe('CheckoutParamInput', () => {
  it('validate', () => {
    const dto = new CheckoutParamInput();
    dto.id = 1;

    return validate(dto)
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.id = -1;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.id = 0;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.id = null;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        (<any>dto).id = 'abc';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      });
  });
});

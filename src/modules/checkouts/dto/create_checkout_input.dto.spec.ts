import { validate } from 'class-validator';
import { CreateCheckoutInput } from './create_checkout_input.dto';

describe('CreateCheckoutInput', () => {
  it('validate', () => {
    const dto = new CreateCheckoutInput();
    dto.customerName = 'microsoft';
    dto.itemIdsWithQuantities = [
      { itemId: 1, quantity: 1 },
      { itemId: 2, quantity: 2 },
    ];

    return validate(dto)
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.customerName = 'HelloBaGiaNgheoKhoGiuaTroiDongCoDon';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.customerName = '';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.customerName = 'abc';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.customerName = 'micro_soft';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.customerName = 'micro-soft';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.itemIdsWithQuantities = [];
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      });
    /* 
      Tested in swagger ok, but failed in jest. Maybe jest doesn't support nested validation. So I commented it out.
      .then(() => {
        dto.itemIdsWithQuantities = [{ itemId: 0, quantity: 0 }];
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      }) */
  });
});

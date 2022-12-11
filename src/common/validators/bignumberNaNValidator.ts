import BigNumber from 'bignumber.js';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  buildMessage,
} from 'class-validator';

export function isNotNaNBigNumber(value: any) {
  if (!(value instanceof BigNumber)) {
    return false;
  }
  return !value.isNaN();
}

export function IsNotNaNBigNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotNaNBigNumber',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: any, args: ValidationArguments) =>
          isNotNaNBigNumber(value),
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property NaN.`,
          validationOptions,
        ),
      },
    });
  };
}

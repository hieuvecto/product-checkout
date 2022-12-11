import { ApiProperty } from '@nestjs/swagger';
import BigNumber from 'bignumber.js';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsNotNaNBigNumber } from 'src/common/validators/bignumberNaNValidator';

export class PayCheckoutInput {
  @ApiProperty({
    description: 'Pay value (In cents)',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new BigNumber(value))
  @IsNotNaNBigNumber()
  value: BigNumber;
}

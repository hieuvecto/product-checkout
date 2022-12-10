import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CheckoutParamInput {
  @ApiProperty({
    description: 'Id of checkout record.',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  id: number;
}

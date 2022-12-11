import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { MAX_ITEM_BUYING_QUANTITY } from 'src/common/constants/constants';

export class ItemIdWithQuantity {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  itemId: number;

  @ApiProperty({
    description: 'quantity must greater than 0 and less than or equal to 1000.',
    example: 10,
  })
  @IsNotEmpty()
  @IsPositive()
  @Max(MAX_ITEM_BUYING_QUANTITY)
  quantity: number;
}

export class CreateCheckoutInput {
  @ApiProperty({
    description: 'The name of customer. REGEX rule: /^[0-9a-zA-Z_-]{6,32}$/ .',
    maxLength: 32,
    example: 'microsoft',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(/^[0-9a-zA-Z_\-]{6,32}$/)
  customerName: string;

  @ApiProperty({
    type: [ItemIdWithQuantity],
    description: 'Item ids must be unique.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(99)
  @ArrayMinSize(1)
  itemIdsWithQuantities: ItemIdWithQuantity[];
}

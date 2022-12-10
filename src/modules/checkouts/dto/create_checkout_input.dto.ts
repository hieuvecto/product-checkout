import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

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
    example: [1, 2, 3],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(99)
  @ArrayMinSize(1)
  @Type(() => Number)
  itemIds: number[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CustomerType } from '../customer.model';

export class CreateCustomerInput {
  @ApiProperty({
    description: 'The name of customer. REGEX rule: /^[0-9a-zA-Z_-]{6,32}$/ .',
    maxLength: 32,
    example: 'microsoft',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(/^[0-9a-zA-Z_\-]{6,32}$/)
  name: string;

  @ApiProperty({
    maxLength: 32,
    example: 'Microsoft',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  displayName: string;

  // TODO: validate valid icon image URL
  @ApiProperty({
    maxLength: 255,
    example: 'https://avatars.githubusercontent.com/u/6154722?s=280&v=4',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  iconImageUrl: string;

  @ApiPropertyOptional({
    enum: [...Object.values(CustomerType)],
  })
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;
}

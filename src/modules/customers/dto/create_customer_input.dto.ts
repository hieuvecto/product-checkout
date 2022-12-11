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

  // TODO: validate url
  @ApiProperty({
    maxLength: 255,
    example:
      'https://upload.wikimedia.org/wikipedia/vi/1/1d/Manchester_City_FC_logo.svg',
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

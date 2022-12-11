import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CustomerType } from '../customer.model';

export class UpdateCustomerInput {
  @ApiPropertyOptional({
    maxLength: 32,
    example: 'Microsoft',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  displayName?: string;

  // TODO: validate URL
  @ApiPropertyOptional({
    maxLength: 255,
    example:
      'https://upload.wikimedia.org/wikipedia/vi/1/1d/Manchester_City_FC_logo.svg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  iconImageUrl?: string;

  @ApiPropertyOptional({
    enum: [...Object.values(CustomerType)],
  })
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;
}

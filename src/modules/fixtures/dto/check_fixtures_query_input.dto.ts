import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class CheckFixturesQueryInput {
  @ApiPropertyOptional({
    description: 'Year number.',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(2000)
  @Max(3000)
  year?: number;

  @ApiPropertyOptional({
    description: 'Month number. From 1 to 12',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({
    description: 'Day number. From 1 to 31',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(31)
  day?: number;
}

import { Type } from 'class-transformer';
import { IsNumber, Max, Min, IsOptional } from 'class-validator';

export class PaginateQueryInput {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(1000)
  limit: number = 20;
}

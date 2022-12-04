import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, Max, Min } from 'class-validator';
import { BooleanEnum } from 'src/common/constants/constants';
import { PaginateQueryInput } from 'src/common/dto/paginate_query_input.dto';

export enum FixturesOrderBy {
  createdAt = 'createdAt',
  begunAt = 'begunAt',
}

export class FixturesQueryInput extends PaginateQueryInput {
  @ApiPropertyOptional({
    enum: [...Object.values(FixturesOrderBy)],
  })
  @IsOptional()
  @IsEnum(FixturesOrderBy)
  orderBy: FixturesOrderBy = FixturesOrderBy.begunAt;

  @ApiPropertyOptional({
    enum: [...Object.values(BooleanEnum)],
  })
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  asc?: boolean;

  @ApiPropertyOptional({
    description:
      'Year number. Specify all three year, month, day to filter fixtures on that date ',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiPropertyOptional({
    description: 'Month number. From 1 to 12',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;

  @ApiPropertyOptional({
    description: 'Day number. From 1 to 31',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(31)
  day: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
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
}

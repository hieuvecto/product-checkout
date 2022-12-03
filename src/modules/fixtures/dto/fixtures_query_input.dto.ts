import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginateQueryInput } from 'src/common/dto/paginate_query_input.dto';

export enum FixturesOrderBy {
  createdAt = 'createdAt',
  begunAt = 'begunAt',
}

export class FixturesQueryInput extends PaginateQueryInput {
  @IsOptional()
  @IsEnum(FixturesOrderBy)
  orderBy: FixturesOrderBy = FixturesOrderBy.begunAt;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  asc?: boolean;
}

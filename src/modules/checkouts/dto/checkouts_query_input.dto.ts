import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, Max, Min } from 'class-validator';
import { BooleanEnum } from 'src/common/constants/constants';
import { PaginateQueryInput } from 'src/common/dto/paginate_query_input.dto';

export enum CheckoutsOrderBy {
  createdAt = 'createdAt',
  confirmedAt = 'confirmedAt',
}

export class CheckoutsQueryInput extends PaginateQueryInput {
  @ApiPropertyOptional({
    enum: [...Object.values(CheckoutsOrderBy)],
  })
  @IsOptional()
  @IsEnum(CheckoutsOrderBy)
  orderBy: CheckoutsOrderBy = CheckoutsOrderBy.confirmedAt;

  @ApiPropertyOptional({
    enum: [...Object.values(BooleanEnum)],
  })
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  asc?: boolean;
}

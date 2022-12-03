import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class FixtureParamInput {
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  id: number;
}

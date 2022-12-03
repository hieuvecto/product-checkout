import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class FixtureParamInput {
  @ApiProperty({
    description: 'Id of fixture record.',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  id: number;
}

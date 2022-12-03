import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateFixtureInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  tournamentName: string;

  @IsNotEmpty()
  @IsPositive()
  homeTeamId: number;

  @IsNotEmpty()
  @IsPositive()
  awayTeamId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  begunAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endedAt: Date;
}

import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateFixtureInput {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tournamentName?: string;

  @IsOptional()
  @IsPositive()
  homeTeamId?: number;

  @IsOptional()
  @IsPositive()
  awayTeamId?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  begunAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endedAt?: Date;

  @IsOptional()
  @IsPositive()
  homeTeamScore?: number;

  @IsOptional()
  @IsPositive()
  awayTeamScore?: number;
}

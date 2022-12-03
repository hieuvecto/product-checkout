import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    maxLength: 100,
    example: 'Champion League',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tournamentName?: string;

  @ApiPropertyOptional({
    description: 'The id of home team.',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  homeTeamId?: number;

  @ApiPropertyOptional({
    description: 'The id of away team. Must not be equal to homeTeamId',
    example: 2,
  })
  @IsOptional()
  @IsPositive()
  awayTeamId?: number;

  @ApiPropertyOptional({
    description: 'Fixture start time. Must be ISO datestring.',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  begunAt?: Date;

  @ApiPropertyOptional({
    description:
      'Fixture end time. Must be after start time and be ISO datestring.',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endedAt?: Date;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  homeTeamScore?: number;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  awayTeamScore?: number;
}

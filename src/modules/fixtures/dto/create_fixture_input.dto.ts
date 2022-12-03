import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    maxLength: 100,
    example: 'Champion League',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  tournamentName: string;

  @ApiProperty({
    description: 'The id of home team.',
    example: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  homeTeamId: number;

  @ApiProperty({
    description: 'The id of away team. Must not be equal to homeTeamId',
    example: 2,
  })
  @IsNotEmpty()
  @IsPositive()
  awayTeamId: number;

  @ApiProperty({
    description: 'Fixture start time. Must be ISO datestring.',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  begunAt: Date;

  @ApiProperty({
    description:
      'Fixture end time. Must be after start time and be ISO datestring.',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endedAt: Date;
}

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateTeamInput {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  displayName?: string;

  // TODO: validate URL
  @IsOptional()
  @IsString()
  @MaxLength(255)
  iconImageUrl?: string;
}

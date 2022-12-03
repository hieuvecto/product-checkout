import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateTeamInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(/^[0-9a-zA-Z_\-]{6,32}$/)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  iconImageUrl?: string;
}

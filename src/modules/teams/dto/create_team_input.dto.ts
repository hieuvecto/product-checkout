import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTeamInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(/^[0-9a-zA-Z_\-]{6,32}$/)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  displayName: string;

  // TODO: validate url
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  iconImageUrl: string;
}

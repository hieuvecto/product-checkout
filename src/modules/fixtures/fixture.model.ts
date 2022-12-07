import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from '../teams/team.model';

@Entity()
export class Fixture {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @CreateDateColumn()
  @Index()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  @Index()
  readonly updatedAt?: Date;

  @Column({ nullable: true })
  @Index()
  public deletedAt: Date | null;

  // TODO: seperating tournament table.
  @ApiProperty()
  @Column({ length: 100, collation: 'utf8mb4_unicode_ci' })
  public tournamentName: string;

  @ApiProperty()
  @Column()
  public homeTeamId: number;

  @ApiProperty({ type: () => Team })
  @ManyToOne((type) => Team, (team) => team.homeFixtures)
  @JoinColumn({ name: 'home_team_id' })
  public homeTeam: Team | null;

  @ApiProperty()
  @Column()
  public awayTeamId: number;

  @ApiProperty({ type: () => Team })
  @ManyToOne((type) => Team, (team) => team.awayFixtures)
  @JoinColumn({ name: 'away_team_id' })
  public awayTeam: Team | null;

  @ApiProperty()
  @Column({ default: 0 })
  public homeTeamScore: number;

  @ApiProperty()
  @Column({ default: 0 })
  public awayTeamScore: number;

  @ApiProperty()
  @Column()
  @Index()
  public begunAt: Date;

  @ApiProperty()
  @Column()
  @Index()
  public endedAt: Date;
}

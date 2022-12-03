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

  @Column({ length: 100, collation: 'utf8mb4_unicode_ci' })
  public tournamentName: string;

  @Column()
  public homeTeamId: number;

  @ManyToOne((type) => Team, (team) => team.homeFixtures)
  @JoinColumn({ name: 'home_team_id' })
  public homeTeam: Team | null;

  @Column()
  public awayTeamId: number;

  @ManyToOne((type) => Team, (team) => team.awayFixtures)
  @JoinColumn({ name: 'away_team_id' })
  public awayTeam: Team | null;

  @Column({ default: 0 })
  public homeTeamScore: number;

  @Column({ default: 0 })
  public awayTeamScore: number;

  @Column()
  @Index()
  public begunAt: Date;

  @Column()
  @Index()
  public endedAt: Date;
}

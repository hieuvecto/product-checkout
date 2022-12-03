import {
  Entity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Fixture } from '../fixtures/fixture.model';

@Entity()
export class Team {
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

  @Column({ length: 32 })
  @Index({ unique: true })
  public name: string;

  @Column({ length: 32, collation: 'utf8mb4_unicode_ci' })
  public displayName: string;

  @Column({ nullable: true })
  public iconImageUrl: string | null;

  @OneToMany((type) => Fixture, (fixture) => fixture.homeTeamId)
  readonly homeFixtures: Fixture[];

  @OneToMany((type) => Fixture, (fixture) => fixture.awayTeamId)
  readonly awayFixtures: Fixture[];
}

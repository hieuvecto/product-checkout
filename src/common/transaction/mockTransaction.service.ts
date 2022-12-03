import { Injectable } from '@nestjs/common';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { Fixture } from 'src/modules/fixtures/fixture.model';
import { Team } from 'src/modules/teams/team.model';
import { EntityManager, QueryRunner, Repository } from 'typeorm';

class MockEntityManager extends EntityManager {
  constructor(private mockRepositories: Map<string, any>) {
    super(null, null);
    this.mockRepositories = mockRepositories;
  }

  private getMockRepository(entity) {
    if (entity.hasOwnProperty('name') && entity.hasOwnProperty('displayName')) {
      return this.mockRepositories.get('Team');
    } else if (entity.hasOwnProperty('tournamentName')) {
      return this.mockRepositories.get('Fixture');
    }

    return null;
  }

  private _save(entity) {
    const r = this.getMockRepository(entity);
    if (r) {
      r.save(entity);
    }
  }

  async save(entity) {
    if (Array.isArray(entity)) {
      entity.forEach((e) => this._save(e));
    } else {
      this._save(entity);
    }
    return null;
  }

  async findOne(targetClass, args) {
    const r = this.mockRepositories.get(targetClass.name);
    if (r) {
      return r.findOne(args);
    }
    return null;
  }

  async update(targetClass, key, entity) {
    const r = this.mockRepositories.get(targetClass.name);
    if (r) {
      r.save(entity);
    }
    return null;
  }
}

export class MockQueryRunner {
  manager = null;
  constructor(mockRepositories: Map<any, any>) {
    this.manager = new MockEntityManager(mockRepositories);
  }
}

/**
 * Generate a QueryRunner that uses the repository for testing
 */
@Injectable()
export class MockTransactionService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Fixture)
    private readonly fixtureRepository: Repository<Fixture>,
  ) {}

  static NullRepositories = [
    { provide: getRepositoryToken(Team), useValue: null },
    { provide: getRepositoryToken(Fixture), useValue: null },
  ];

  startTransaction = jest.fn(async (): Promise<QueryRunner> => {
    const mockRepositories = new Map<string, any>();
    mockRepositories.set('Team', this.teamRepository);
    mockRepositories.set('Fixture', this.fixtureRepository);
    const queryRunner = new MockQueryRunner(mockRepositories) as QueryRunner;
    (<any>queryRunner).isTransactionActive = true;
    return queryRunner;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  commit = jest.fn(async (queryRunner: QueryRunner): Promise<void> => {
    return;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rollback = jest.fn(async (queryRunner: QueryRunner): Promise<void> => {
    return;
  });
}

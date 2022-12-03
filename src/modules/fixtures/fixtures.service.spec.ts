import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import parseISO from 'date-fns/parseISO';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { MockTransactionService } from '../../common/transaction/mockTransaction.service';
import configuration from '../../config/configuration';
import { Team } from '../teams/team.model';
import { TeamsService } from '../teams/teams.service';
import { CreateFixtureInput } from './dto/create_fixture_input.dto';
import { Fixture } from './fixture.model';
import { FixturesService } from './fixtures.service';

describe('FixturesService', () => {
  let service: FixturesService;
  let teamsService: TeamsService;

  const mockFixtureRepo = new Repository<Fixture>();
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FixturesService,
        TeamsService,
        { provide: 'TransactionInterface', useClass: MockTransactionService },
        ...MockTransactionService.NullRepositories,
        {
          provide: getRepositoryToken(Fixture),
          useValue: mockFixtureRepo,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.development',
          load: [configuration],
          isGlobal: true,
        }),
      ],
    }).compile();

    service = module.get<FixturesService>(FixturesService);
    teamsService = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('success: createFixture', () => {
    jest
      .spyOn(<any>teamsService, 'getTeamsByIdsWithLock')
      .mockImplementation(() =>
        Promise.resolve([
          { id: 1, name: 'liverpool' },
          { id: 2, name: 'manchester-united' },
        ] as unknown as Team[]),
      );

    jest
      .spyOn(mockFixtureRepo, 'create')
      .mockImplementation((model: any) => model as Fixture);
    jest.spyOn(mockFixtureRepo, 'save').mockImplementation((model: any) => {
      model.id = 1;
      return model;
    });

    const dto = new CreateFixtureInput();
    dto.tournamentName = 'Champion League';
    dto.homeTeamId = 1;
    dto.awayTeamId = 2;
    dto.begunAt = parseISO('2022-12-16T10:30:00.000Z');
    dto.endedAt = parseISO('2022-12-16T12:30:00.000Z');

    return service.createFixture(dto).then((fixture) => {
      expect(fixture.id).toEqual(1);
      expect(mockFixtureRepo.create).toBeCalled();
      expect(mockFixtureRepo.save).toBeCalled();
      expect((<any>service).transaction.startTransaction).toBeCalled();
      expect((<any>service).transaction.commit).toBeCalled();
      expect((<any>service).transaction.rollback).not.toBeCalled();
    });
  });
});

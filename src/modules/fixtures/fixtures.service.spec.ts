import { HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import parseISO from 'date-fns/parseISO';
import { Request } from 'express';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MockTransactionService } from '../../common/transaction/mockTransaction.service';
import configuration from '../../config/configuration';
import { Team } from '../teams/team.model';
import { TeamsService } from '../teams/teams.service';
import { CreateFixtureInput } from './dto/create_fixture_input.dto';
import { FixtureParamInput } from './dto/fixture_param_input.dto';
import { UpdateFixtureInput } from './dto/update_fixture_input.dto';
import { Fixture } from './fixture.model';
import { FixturesService } from './fixtures.service';

describe('FixturesService', () => {
  let service: FixturesService;
  let teamsService: TeamsService;

  const mockFixtureRepo = new Repository<Fixture>();
  const validBaseFixture = {
    id: 1,
    tournamentName: 'Champion League',
    homeTeamId: 1,
    homeTeam: {
      id: 1,
      name: 'liverpool',
    },
    awayTeamId: 2,
    awayTeam: {
      id: 2,
      name: 'manchester-united',
    },
    homeTeamScore: 0,
    awayTeamScore: 0,
    begunAt: parseISO('2022-12-16T10:30:00.000Z'),
    endedAt: parseISO('2022-12-16T12:30:00.000Z'),
  };
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

  it('fail: createFixture - homeTeamId and awayTeamId are the same', () => {
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
    dto.awayTeamId = 1;
    dto.begunAt = parseISO('2022-12-16T10:30:00.000Z');
    dto.endedAt = parseISO('2022-12-16T12:30:00.000Z');

    return service
      .createFixture(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        expect((<any>teamsService).getTeamsByIdsWithLock).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('fail: createFixture - begunAt is after endedAt', () => {
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
    dto.begunAt = parseISO('2022-12-17T10:30:00.000Z');
    dto.endedAt = parseISO('2022-12-16T12:30:00.000Z');

    return service
      .createFixture(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        expect((<any>teamsService).getTeamsByIdsWithLock).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('fail: createFixture - teams.length < 2', () => {
    jest
      .spyOn(<any>teamsService, 'getTeamsByIdsWithLock')
      .mockImplementation(() =>
        Promise.resolve([{ id: 1, name: 'liverpool' }] as unknown as Team[]),
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

    return service
      .createFixture(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect((<any>teamsService).getTeamsByIdsWithLock).toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('success: getFixture', () => {
    jest.spyOn(<any>service, 'getFixtureById').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        tournamentName: 'Champion League',
      } as unknown as Fixture),
    );

    const dto = new FixtureParamInput();
    dto.id = 1;

    return service.getFixture(dto).then((fixture) => {
      expect(fixture.id).toEqual(1);
      expect((<any>service).getFixtureById).toBeCalled();
    });
  });

  it('fail: getFixture - fixture not found.', () => {
    jest
      .spyOn(<any>service, 'getFixtureById')
      .mockImplementation(() => Promise.resolve(null));

    const dto = new FixtureParamInput();
    dto.id = 1;

    return service
      .getFixture(dto)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect((<any>service).getFixtureById).toBeCalled();
      });
  });

  it('success: updateFixture', () => {
    jest.spyOn(<any>service, 'getFixtureByIdWithLock').mockImplementation(() =>
      Promise.resolve({
        ...validBaseFixture,
      } as unknown as Fixture),
    );

    jest
      .spyOn(<any>teamsService, 'getTeamsByIdsWithLock')
      .mockImplementation(() =>
        Promise.resolve([
          { id: 1, name: 'liverpool' },
          { id: 2, name: 'manchester-united' },
        ] as unknown as Team[]),
      );

    jest.spyOn(mockFixtureRepo, 'save').mockImplementation((model: any) => {
      return model;
    });

    const params = new FixtureParamInput();
    params.id = 1;
    const body = new UpdateFixtureInput();
    body.tournamentName = 'Champion League edited';
    body.homeTeamScore = 2;
    body.awayTeamScore = 3;

    return service.updateFixture(params, body).then((fixture) => {
      expect(fixture.id).toEqual(1);
      expect(fixture.tournamentName).toEqual('Champion League edited');
      expect(fixture.homeTeamScore).toEqual(2);
      expect(fixture.awayTeamScore).toEqual(3);
      expect(mockFixtureRepo.save).toBeCalled();
      expect((<any>service).transaction.startTransaction).toBeCalled();
      expect((<any>service).transaction.commit).toBeCalled();
      expect((<any>service).transaction.rollback).not.toBeCalled();
    });
  });

  it('fail: updateFixture - fixture not found.', () => {
    jest
      .spyOn(<any>service, 'getFixtureByIdWithLock')
      .mockImplementation(() => Promise.resolve(null));

    jest
      .spyOn(<any>teamsService, 'getTeamsByIdsWithLock')
      .mockImplementation(() =>
        Promise.resolve([
          { id: 1, name: 'liverpool' },
          { id: 2, name: 'manchester-united' },
        ] as unknown as Team[]),
      );

    jest.spyOn(mockFixtureRepo, 'save').mockImplementation((model: any) => {
      return model;
    });

    const params = new FixtureParamInput();
    params.id = 1;
    const body = new UpdateFixtureInput();
    body.tournamentName = 'Champion League edited';
    body.homeTeamScore = 2;
    body.awayTeamScore = 3;

    return service
      .updateFixture(params, body)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect((<any>teamsService).getTeamsByIdsWithLock).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('fail: updateFixture - begunAt is after endedAt', () => {
    jest.spyOn(<any>service, 'getFixtureByIdWithLock').mockImplementation(() =>
      Promise.resolve({
        ...validBaseFixture,
      } as unknown as Fixture),
    );

    jest
      .spyOn(<any>teamsService, 'getTeamsByIdsWithLock')
      .mockImplementation(() =>
        Promise.resolve([
          { id: 1, name: 'liverpool' },
          { id: 2, name: 'manchester-united' },
        ] as unknown as Team[]),
      );

    jest.spyOn(mockFixtureRepo, 'save').mockImplementation((model: any) => {
      return model;
    });

    const params = new FixtureParamInput();
    params.id = 1;
    const body = new UpdateFixtureInput();
    body.tournamentName = 'Champion League edited';
    body.homeTeamScore = 2;
    body.awayTeamScore = 3;
    body.begunAt = parseISO('2022-12-17T10:30:00.000Z');
    body.endedAt = parseISO('2022-12-16T12:30:00.000Z');

    return service
      .updateFixture(params, body)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        expect((<any>teamsService).getTeamsByIdsWithLock).not.toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });

  it('fail: updateFixture - teams.lenght < 2', () => {
    jest.spyOn(<any>service, 'getFixtureByIdWithLock').mockImplementation(() =>
      Promise.resolve({
        ...validBaseFixture,
      } as unknown as Fixture),
    );

    jest
      .spyOn(<any>teamsService, 'getTeamsByIdsWithLock')
      .mockImplementation(() =>
        Promise.resolve([{ id: 1, name: 'liverpool' }] as unknown as Team[]),
      );

    jest.spyOn(mockFixtureRepo, 'save').mockImplementation((model: any) => {
      return model;
    });

    const params = new FixtureParamInput();
    params.id = 1;
    const body = new UpdateFixtureInput();
    body.tournamentName = 'Champion League edited';
    body.homeTeamId = 3;
    body.awayTeamId = 4;
    body.homeTeamScore = 2;
    body.awayTeamScore = 3;

    return service
      .updateFixture(params, body)
      .then(() => {
        throw new Error('fail');
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect((<any>teamsService).getTeamsByIdsWithLock).toBeCalled();
        expect((<any>service).transaction.startTransaction).toBeCalled();
        expect((<any>service).transaction.commit).not.toBeCalled();
        expect((<any>service).transaction.rollback).toBeCalled();
      });
  });
});

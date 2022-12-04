import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { Between, QueryRunner, Repository } from 'typeorm';
import { TeamsService } from '../teams/teams.service';
import { CreateFixtureInput } from './dto/create_fixture_input.dto';
import { Fixture } from './fixture.model';
import { FixtureParamInput } from './dto/fixture_param_input.dto';
import { UpdateFixtureInput } from './dto/update_fixture_input.dto';
import { DateTimeUtil } from 'src/common/dateTime/dateTime.util';
import {
  FixturesOrderBy,
  FixturesQueryInput,
} from './dto/fixtures_query_input.dto';
import { CheckFixturesQueryInput } from './dto/check_fixtures_query_input.dto';
import { addDays } from 'date-fns';

@Injectable()
export class FixturesService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transaction: TransactionInterface,

    private readonly teamsService: TeamsService,

    @InjectRepository(Fixture)
    private readonly fixtureRepository: Repository<Fixture>,
  ) {}

  private readonly logger = new Logger(FixturesService.name);

  async createFixture({
    tournamentName,
    homeTeamId,
    awayTeamId,
    begunAt,
    endedAt,
  }: CreateFixtureInput): Promise<Fixture> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to create fixture.');
      });

    try {
      if (
        homeTeamId === awayTeamId ||
        DateTimeUtil.isBefore(endedAt, begunAt)
      ) {
        throw new HttpException('Unvalid parameters', HttpStatus.BAD_REQUEST);
      }

      const teams = await this.teamsService.getTeamsByIdsWithLock(queryRunner, [
        homeTeamId,
        awayTeamId,
      ]);

      if (teams.length < 2) {
        throw new HttpException('Team not found.', HttpStatus.NOT_FOUND);
      }

      const fixture = this.fixtureRepository.create({
        tournamentName,
        homeTeam: teams.find((team) => team.id === homeTeamId),
        awayTeam: teams.find((team) => team.id === awayTeamId),
        begunAt,
        endedAt,
      });

      await queryRunner.manager.save(fixture, { reload: true });

      await this.transaction.commit(queryRunner);

      return fixture;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to create fixture.');
    }
  }

  async getFixture({ id }: FixtureParamInput): Promise<Fixture> {
    try {
      const fixture = await this.getFixtureById(id);
      if (!fixture) {
        throw new HttpException('Fixture not found.', HttpStatus.NOT_FOUND);
      }

      return fixture;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to get fixture.');
    }
  }

  async getFixtures({
    orderBy,
    asc,
    limit,
    offset,
    year,
    month,
    day,
  }: FixturesQueryInput): Promise<Fixture[]> {
    const qb = this.fixtureRepository
      .createQueryBuilder('fixture')
      .innerJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .innerJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .where({
        deletedAt: null,
      })
      .take(limit)
      .skip(offset);

    switch (orderBy) {
      case FixturesOrderBy.createdAt:
        qb.orderBy('fixture.createdAt', asc ? 'ASC' : 'DESC');
        break;
      case FixturesOrderBy.begunAt:
        qb.orderBy('fixture.begunAt', asc ? 'ASC' : 'DESC');
        break;
      default:
        break;
    }

    if (year && month && day) {
      const date = DateTimeUtil.createFromYMD(year, month, day);
      if (!date) {
        throw new HttpException(
          'Unvalid year, month, day',
          HttpStatus.BAD_REQUEST,
        );
      }

      qb.andWhere('fixture.begunAt BETWEEN :fromDate AND :toDate', {
        fromDate: date,
        toDate: addDays(date, 1),
      });
    }

    return qb.getMany().catch((e) => {
      this.logger.error(e);
      throw new Error('Failed to get fixtures.');
    });
  }

  async updateFixture(
    { id }: FixtureParamInput,
    args: UpdateFixtureInput,
  ): Promise<Fixture> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to update fixture.');
      });

    try {
      const fixture = await this.getFixtureByIdWithLock(queryRunner, id);
      if (!fixture) {
        throw new HttpException('Fixture not found.', HttpStatus.NOT_FOUND);
      }

      fixture.tournamentName = args.tournamentName ?? fixture.tournamentName;
      fixture.homeTeamId = args.homeTeamId ?? fixture.homeTeamId;
      fixture.awayTeamId = args.awayTeamId ?? fixture.awayTeamId;
      fixture.begunAt = args.begunAt ?? fixture.begunAt;
      fixture.endedAt = args.endedAt ?? fixture.endedAt;
      fixture.homeTeamScore = args.homeTeamScore ?? fixture.homeTeamScore;
      fixture.awayTeamScore = args.awayTeamScore ?? fixture.awayTeamScore;

      if (
        fixture.homeTeamId === fixture.awayTeamId ||
        DateTimeUtil.isBefore(fixture.endedAt, fixture.begunAt)
      ) {
        throw new HttpException('Unvalid parameters', HttpStatus.BAD_REQUEST);
      }

      const teams = await this.teamsService.getTeamsByIdsWithLock(queryRunner, [
        fixture.homeTeamId,
        fixture.awayTeamId,
      ]);
      if (teams.length < 2) {
        throw new HttpException('Team not found.', HttpStatus.NOT_FOUND);
      }

      await queryRunner.manager.save(fixture, { reload: false });

      fixture.homeTeam = teams.find((team) => team.id === fixture.homeTeamId);
      fixture.awayTeam = teams.find((team) => team.id === fixture.awayTeamId);

      await this.transaction.commit(queryRunner);

      return fixture;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to update fixture.');
    }
  }

  async deleteFixture({ id }: FixtureParamInput): Promise<boolean> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to delete fixture.');
      });

    try {
      const fixture = await this.getFixtureByIdWithLock(queryRunner, id);
      if (!fixture) {
        throw new HttpException('Fixture not found.', HttpStatus.NOT_FOUND);
      }

      fixture.deletedAt = DateTimeUtil.getCurrentTime();
      await queryRunner.manager.save(fixture, { reload: false });

      await this.transaction.commit(queryRunner);

      return true;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to update fixture.');
    }
  }

  async checkIfFixtureStartOnDay({
    year,
    month,
    day,
  }: CheckFixturesQueryInput): Promise<boolean> {
    try {
      if (!year || !month || !day) {
        throw new HttpException(
          'Year, month, day are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const date = DateTimeUtil.createFromYMD(year, month, day);
      if (!date) {
        throw new HttpException(
          'Unvalid year, month, day.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const fixture = await this.fixtureRepository
        .createQueryBuilder('fixture')
        .where({
          begunAt: Between(date, addDays(date, 1)),
          deletedAt: null,
        })
        .getOne();

      return !!fixture;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to check fixture.');
    }
  }

  /**
   * Check Fixtures start on the days array in one month. For querying once instead of many queries
   * when opening calendar.
   */
  async checkIfFixturesStartOnDaysInMonth({
    year,
    month,
  }: CheckFixturesQueryInput): Promise<boolean[]> {
    try {
      if (!year || !month) {
        throw new HttpException(
          'Year, month are required.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const daysInMonth = DateTimeUtil.getDaysInMonth(year, month);

      // MAYBE DANGEROUS SQL INJECTION: but worthy for increasing the performance when opening the calendar.
      const baseRawQueryGenerator = (dayIndex: number) => `
      -- Query for checking whether at least a fixture exists between fromDate and toDate
        SELECT 
          id
          deleted_at
        FROM 
          fixtures
        WHERE 
          fixtures.begun_at BETWEEN :fromDate${dayIndex} AND : toDate${dayIndex}
        LIMIT 1
      `;
      const unionClause = `
        UNION
    `;
      const rawQuery = daysInMonth
        .map((date, index) => baseRawQueryGenerator(index))
        .join(unionClause);

      const qb = this.fixtureRepository.manager
        .createQueryBuilder()
        .select('mergedFixtures.*')
        .from('(' + rawQuery + ')', 'mergedFixtures');

      const paramsObject = {};
      daysInMonth.forEach((date, index) => {
        paramsObject[`fromDate${index}`] = date;
        paramsObject[`toDate${index}`] = addDays(date, 1);
      });

      qb.setParameters({
        ...paramsObject,
      }).where('mergedFixtures.deleted_at is null');

      const rows = await qb.getRawMany();

      const result = daysInMonth.map((date, index) => {
        const correspondFixture = rows.find(
          (row) =>
            DateTimeUtil.isAfter(row['begun_at'], date) &&
            DateTimeUtil.isBefore(row['begun_at'], addDays(date, 1)),
        );

        return !!correspondFixture;
      });

      return result;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      this.logger.error(e);
      throw new Error('Failed to check fixtures.');
    }
  }

  private async getFixtureByIdWithLock(
    queryRunner: QueryRunner,
    id: number,
  ): Promise<Fixture> {
    return queryRunner.manager
      .getRepository(Fixture)
      .createQueryBuilder('fixture')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('fixture.id = :id', { id })
      .andWhere('fixture.deleted_at is null')
      .getOne();
  }

  private getFixtureById(id: number): Promise<Fixture> {
    return this.fixtureRepository
      .createQueryBuilder('fixture')
      .innerJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .innerJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .where({
        id,
        deletedAt: null,
      })
      .getOne();
  }
}

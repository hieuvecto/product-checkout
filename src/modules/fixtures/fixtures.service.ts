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

  /**
   * Create fixture
   * @param {CreateFixtureInput} args - body input fields such as tournamentName, homeTeamId, awayTeamId, ...
   * @return {Fixture} Fixture record with the joined homeTeam, awayTeam records.
   * @throws {HttpException} - Http exception with status code = 400, 404.
   * @throws {Error} - Internal server error.
   */
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
      /** Params validation. */
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
      /** End: Params validation. */

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

  /**
   * Get specific fixture record.
   * @param {FixtureParamInput} {id} - id of fixture record.
   * @return {Fixture} Fixture record with the joined homeTeam, awayTeam records.
   * @throws {HttpException} - Http exception with status code = 404.
   * @throws {Error} - Internal server error.
   */
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

  /**
   * Get the array of fixture records with specified parameters.
   * @param {FixturesQueryInput} args - query input fields such as offset, limit, orderBy, asc, ...
   * @return {Fixture[]} Fixture records.
   * @throws {HttpException} - Http exception with status code = 400.
   * @throws {Error} - Internal server error.
   */
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

    // Add order by to query builder.
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

    // If you want to query fixtures by date, all three year, month, day are required.
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

  /**
   * Update the fixture record
   * @param {FixtureParamInput} {id} - id of fixture record.
   * @param {UpdateFixtureInput} args - body input fields such as tournamentName, homeTeamId, awayTeamId, ...
   * @return {Fixture} Fixture record with the joined homeTeam, awayTeam records.
   * @throws {HttpException} - Http exception with status code = 400, 404.
   * @throws {Error} - Internal server error.
   */
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

      // Assign the parameters into fixture model.
      fixture.tournamentName = args.tournamentName ?? fixture.tournamentName;
      fixture.homeTeamId = args.homeTeamId ?? fixture.homeTeamId;
      fixture.awayTeamId = args.awayTeamId ?? fixture.awayTeamId;
      fixture.begunAt = args.begunAt ?? fixture.begunAt;
      fixture.endedAt = args.endedAt ?? fixture.endedAt;
      fixture.homeTeamScore = args.homeTeamScore ?? fixture.homeTeamScore;
      fixture.awayTeamScore = args.awayTeamScore ?? fixture.awayTeamScore;

      /** fixture model fields validation. */
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
      /** End: fixture model fields validation. */

      await queryRunner.manager.save(fixture, { reload: false });

      // Join the homeTeam, awayTeam models into fixture model for minimizing queries.
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

  /**
   * Set the deleted_at field of fixture record to be now()
   * @param {FixtureParamInput} {id} - id of fixture record.
   * @return {Boolean}
   * @throws {HttpException} - Http exception with status code = 400, 404.
   * @throws {Error} - Internal server error.
   */
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

  /**
   * Check whether at least a fixture starts on a specified date.
   * @param {CheckFixturesQueryInput} args - All three year, month, day are required
   * @return {Boolean}
   * @throws {HttpException} - Http exception with status code = 400.
   * @throws {Error} - Internal server error.
   */
  async checkIfFixtureStartOnDay({
    year,
    month,
    day,
  }: CheckFixturesQueryInput): Promise<boolean> {
    try {
      /** Year, month, day validation. */
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
      /** End: Year, month, day validation. */

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
   * Check whether Fixtures start on each day in one month. For querying once instead of many queries
   * when opening the calendar.
   * @param {CheckFixturesQueryInput} args - year, month are required
   * @return {Boolean}
   * @throws {HttpException} - Http exception with status code = 400.
   * @throws {Error} - Internal server error.
   */
  async checkIfFixturesStartOnDaysInMonth({
    year,
    month,
  }: CheckFixturesQueryInput): Promise<boolean[]> {
    try {
      // Year, month validations.
      if (!year || !month) {
        throw new HttpException(
          'Year, month are required.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const daysInMonth = DateTimeUtil.getDaysInMonth(year, month);

      // MAYBE DANGEROUS SQL INJECTION: but worthy for increasing the performance when opening the calendar.
      const baseRawQueryGenerator = (dayIndex: number) => `
      (
      -- Query for checking whether at least a fixture exists between fromDate and toDate
        SELECT 
          id,
          deleted_at,
          begun_at
        FROM 
          fixtures
        WHERE 
          fixtures.begun_at BETWEEN :fromDate${dayIndex} AND :toDate${dayIndex}
          and fixtures.deleted_at is null
        LIMIT 1
      )
      `;
      const unionClause = `
        UNION
    `;
      const rawQuery = daysInMonth
        .map((date, index) => baseRawQueryGenerator(index))
        .join(unionClause);

      // Create the query buider with the generated raw query.
      const qb = this.fixtureRepository.manager
        .createQueryBuilder()
        .select('mergedFixtures.*')
        .from('(' + rawQuery + ')', 'mergedFixtures');

      // Compute the params object and set it into the query builder.
      const paramsObject: Record<string, Date> = {};
      daysInMonth.forEach((date, index) => {
        paramsObject[`fromDate${index}`] = date;
        paramsObject[`toDate${index}`] = addDays(date, 1);
      });
      qb.setParameters({
        ...paramsObject,
      }).where('mergedFixtures.deleted_at is null');

      const rows = await qb.getRawMany();

      // Extract the rows and compute the boolean result on each day.
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

  /**
   * Get a fixture record by id with lock.
   * @throws {Error} sql, db related error.
   */
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

  /**
   * Get a fixture record by id.
   * @throws {Error} sql, db related error.
   */
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

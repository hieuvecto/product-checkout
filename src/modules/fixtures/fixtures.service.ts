import { isBefore, parseISO } from 'date-fns';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { QueryRunner, Repository } from 'typeorm';
import { TeamsService } from '../teams/teams.service';
import { CreateFixtureInput } from './dto/create_fixture_input.dto';
import { Fixture } from './fixture.model';
import { FixtureParamInput } from './dto/fixture_param_input.dto';
import { UpdateFixtureInput } from './dto/update_fixture_input.dto';
import { DateTimeUtil } from 'src/common/dateTime/dateTime.util';

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
      if (homeTeamId === awayTeamId || isBefore(endedAt, begunAt)) {
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
    const qb = this.fixtureRepository
      .createQueryBuilder('fixture')
      .innerJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .innerJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .where({
        id,
        deletedAt: null,
      });

    return qb.getOne().catch((e) => {
      this.logger.error(e);
      throw new Error('Failed to get fixture.');
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
        isBefore(fixture.endedAt, fixture.begunAt)
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
}

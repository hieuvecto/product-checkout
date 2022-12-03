import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTimeUtil } from 'src/common/dateTime/dateTime.util';
import { TransactionInterface } from 'src/common/transaction/transaction.interface';
import { QueryRunner, Repository } from 'typeorm';
import { CreateTeamInput } from './dto/create_team_input.dto';
import { TeamsQueryInput } from './dto/teams_query_input.dto';
import { TeamParamInput } from './dto/team_param_input.dto';
import { UpdateTeamInput } from './dto/update_team_input.dto';
import { Team } from './team.model';

@Injectable()
export class TeamsService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transaction: TransactionInterface,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  private readonly logger = new Logger(TeamsService.name);

  async createTeam(args: CreateTeamInput): Promise<Team> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to create team.');
      });

    try {
      const team = this.teamRepository.create({
        name: args.name,
        displayName: args.displayName,
        iconImageUrl: args.iconImageUrl,
      });

      await queryRunner.manager.save(team, { reload: true });

      await this.transaction.commit(queryRunner);

      return team;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      this.logger.error(e);
      throw new Error('Failed to create team.');
    }
  }

  async getTeam({ name }: TeamParamInput): Promise<Team> {
    const qb = this.teamRepository.createQueryBuilder('team').where({
      name,
      deletedAt: null,
    });

    try {
      const team = await qb.getOne();
      if (!team) {
        throw new HttpException('Team not found.', HttpStatus.NOT_FOUND);
      }

      return team;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to update team.');
    }
  }

  async getTeams({ limit, offset }: TeamsQueryInput): Promise<Team[]> {
    const qb = this.teamRepository
      .createQueryBuilder('team')
      .where({
        deletedAt: null,
      })
      .take(limit)
      .skip(offset);

    return qb.getMany().catch((e) => {
      this.logger.error(e);
      throw new Error('Failed to get teams.');
    });
  }

  async updateTeam(
    { name }: TeamParamInput,
    args: UpdateTeamInput,
  ): Promise<Team> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to update team.');
      });

    try {
      const team = await this.getTeamByNameWithLock(queryRunner, name);

      if (!team) {
        throw new HttpException('Team not found.', HttpStatus.NOT_FOUND);
      }

      team.displayName = args.displayName ?? team.displayName;
      team.iconImageUrl = args.iconImageUrl ?? team.iconImageUrl;

      await queryRunner.manager.save(team, { reload: false });

      await this.transaction.commit(queryRunner);

      return team;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to update team.');
    }
  }

  async deleteTeam({ name }: TeamParamInput): Promise<boolean> {
    const queryRunner = await this.transaction
      .startTransaction()
      .catch(async (e) => {
        this.logger.error(`Failed to start transaction. ${e}`);
        throw new Error('Failed to update team.');
      });

    try {
      const team = await this.getTeamByNameWithLock(queryRunner, name);

      if (!team) {
        throw new HttpException('Team not found.', HttpStatus.NOT_FOUND);
      }

      team.deletedAt = DateTimeUtil.getCurrentTime();

      await queryRunner.manager.save(team, { reload: false });

      await this.transaction.commit(queryRunner);

      return true;
    } catch (e) {
      if (queryRunner.isTransactionActive)
        await this.transaction.rollback(queryRunner);

      if (e instanceof HttpException) {
        throw e;
      }
      this.logger.error(e);
      throw new Error('Failed to delete team.');
    }
  }

  public async getTeamsByIdsWithLock(
    queryRunner: QueryRunner,
    ids: number[],
  ): Promise<Team[]> {
    return queryRunner.manager
      .getRepository(Team)
      .createQueryBuilder('team')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('team.id in (:...ids)', { ids })
      .andWhere('team.deleted_at is null')
      .getMany();
  }

  private async getTeamByNameWithLock(
    queryRunner: QueryRunner,
    name: string,
  ): Promise<Team> {
    return queryRunner.manager
      .getRepository(Team)
      .createQueryBuilder('team')
      .useTransaction(false)
      .setLock('pessimistic_write')
      .where('team.name = :name', { name })
      .andWhere('team.deleted_at is null')
      .getOne();
  }
}

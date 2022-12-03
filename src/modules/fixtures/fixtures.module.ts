import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { TeamsModule } from '../teams/teams.module';
import { Fixture } from './fixture.model';
import { FixturesController } from './fixtures.controller';
import { FixturesService } from './fixtures.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fixture]), TeamsModule],
  controllers: [FixturesController],
  providers: [
    FixturesService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [FixturesService, TypeOrmModule],
})
export class FixturesModule {}

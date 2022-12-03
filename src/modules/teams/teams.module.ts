import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Team } from './team.model';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [TeamsController],
  providers: [
    TeamsService,
    { provide: 'TransactionInterface', useClass: TransactionService },
  ],
  exports: [TeamsService, TypeOrmModule],
})
export class TeamsModule {}

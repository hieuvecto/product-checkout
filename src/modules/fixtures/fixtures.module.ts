import { Module } from '@nestjs/common';
import { FixturesController } from './fixtures.controller';
import { FixturesService } from './fixtures.service';

@Module({
  imports: [],
  controllers: [FixturesController],
  providers: [FixturesService],
})
export class FixturesModule {}

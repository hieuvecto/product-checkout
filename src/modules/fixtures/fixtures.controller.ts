import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateFixtureInput } from './dto/create_fixture_input.dto';
import { FixturesQueryInput } from './dto/fixtures_query_input.dto';
import { FixtureParamInput } from './dto/fixture_param_input.dto';
import { UpdateFixtureInput } from './dto/update_fixture_input.dto';
import { Fixture } from './fixture.model';
import { FixturesService } from './fixtures.service';

@Controller('fixtures')
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Post()
  async createFixture(@Body() args: CreateFixtureInput): Promise<Fixture> {
    return this.fixturesService.createFixture(args);
  }

  @Get(':id')
  async getFixture(@Param() params: FixtureParamInput): Promise<Fixture> {
    return this.fixturesService.getFixture(params);
  }

  @Get()
  async getFixtures(@Query() queries: FixturesQueryInput): Promise<Fixture[]> {
    return this.fixturesService.getFixtures(queries);
  }

  @Put(':id')
  async updateFixture(
    @Param() params: FixtureParamInput,
    @Body() args: UpdateFixtureInput,
  ): Promise<Fixture> {
    return this.fixturesService.updateFixture(params, args);
  }

  @Delete(':id')
  async deleteFixture(@Param() params: FixtureParamInput): Promise<boolean> {
    return this.fixturesService.deleteFixture(params);
  }
}

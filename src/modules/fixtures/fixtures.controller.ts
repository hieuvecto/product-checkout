import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CheckFixturesQueryInput } from './dto/check_fixtures_query_input.dto';
import { CreateFixtureInput } from './dto/create_fixture_input.dto';
import { FixturesQueryInput } from './dto/fixtures_query_input.dto';
import { FixtureParamInput } from './dto/fixture_param_input.dto';
import { UpdateFixtureInput } from './dto/update_fixture_input.dto';
import { Fixture } from './fixture.model';
import { FixturesService } from './fixtures.service';

@Controller({
  path: 'fixtures',
  version: '1',
})
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Post()
  @ApiOkResponse({ type: Fixture })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async createFixture(@Body() args: CreateFixtureInput): Promise<Fixture> {
    return this.fixturesService.createFixture(args);
  }

  @Get()
  @ApiOkResponse({ type: [Fixture] })
  @ApiInternalServerErrorResponse()
  async getFixtures(@Query() queries: FixturesQueryInput): Promise<Fixture[]> {
    return this.fixturesService.getFixtures(queries);
  }

  /**
   * 'Check whether fixtures exist in a specify year, month, day',
   */
  @Get('/checkStartOnDay')
  @ApiOkResponse({ type: Boolean })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiQuery({
    description: 'In this case all three year, month, day are required.',
  })
  async checkIfFixtureStartOnDay(
    @Query() queries: CheckFixturesQueryInput,
  ): Promise<boolean> {
    return this.fixturesService.checkIfFixtureStartOnDay(queries);
  }

  /**
   * Check whether fixtures exist in days range (one month instead),
   */
  @Get('/checkStartOnDaysInMonth')
  @ApiOkResponse({ type: [Boolean] })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiQuery({
    required: false,
    description:
      'In this case only year and month are required. day is useless',
  })
  async checkIfFixturesStartOnDaysInMonth(
    @Query() queries: CheckFixturesQueryInput,
  ): Promise<boolean[]> {
    return this.fixturesService.checkIfFixturesStartOnDaysInMonth(queries);
  }

  @Get(':id')
  @ApiOkResponse({ type: Fixture })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async getFixture(@Param() params: FixtureParamInput): Promise<Fixture> {
    return this.fixturesService.getFixture(params);
  }

  @Put(':id')
  @ApiOkResponse({ type: Fixture })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async updateFixture(
    @Param() params: FixtureParamInput,
    @Body() args: UpdateFixtureInput,
  ): Promise<Fixture> {
    return this.fixturesService.updateFixture(params, args);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async deleteFixture(@Param() params: FixtureParamInput): Promise<boolean> {
    return this.fixturesService.deleteFixture(params);
  }
}

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

  @Get(':id')
  @ApiOkResponse({ type: Fixture })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async getFixture(@Param() params: FixtureParamInput): Promise<Fixture> {
    return this.fixturesService.getFixture(params);
  }

  @Get()
  @ApiOkResponse({ type: [Fixture] })
  @ApiInternalServerErrorResponse()
  async getFixtures(@Query() queries: FixturesQueryInput): Promise<Fixture[]> {
    return this.fixturesService.getFixtures(queries);
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

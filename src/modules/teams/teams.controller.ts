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
import { CreateTeamInput } from './dto/create_team_input.dto';
import { GetTeamsQueryInput } from './dto/get_teams_query_input.dto';
import { TeamParamInput } from './dto/team_param_input.dto';
import { UpdateTeamInput } from './dto/update_team_input.dto';
import { Team } from './team.model';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async createTeam(@Body() args: CreateTeamInput): Promise<Team> {
    return this.teamsService.createTeam(args);
  }

  @Get(':name')
  async getTeam(@Param() params: TeamParamInput): Promise<Team> {
    return this.teamsService.getTeam(params);
  }

  @Get()
  async getTeams(@Query() query: GetTeamsQueryInput): Promise<Team[]> {
    return this.teamsService.getTeams(query);
  }

  @Put(':name')
  async updateTeam(
    @Param() params: TeamParamInput,
    @Body() args: UpdateTeamInput,
  ): Promise<Team> {
    return this.teamsService.updateTeam(params, args);
  }

  @Delete(':name')
  async deleteTeam(@Param() params: TeamParamInput): Promise<boolean> {
    return this.teamsService.deleteTeam(params);
  }
}

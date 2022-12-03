import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTeamInput } from './dto/create_team_input.dto';
import { DeleteTeamInput } from './dto/delete_team_input.dto';
import { GetTeamParamsInput } from './dto/get_team_params_input.dto';
import { UpdateTeamInput } from './dto/update_team_input.dto';
import { Team } from './team.model';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create')
  async createTeam(@Body() args: CreateTeamInput): Promise<Team> {
    return this.teamsService.createTeam(args);
  }

  @Get(':name')
  async getTeam(@Param() params: GetTeamParamsInput): Promise<Team> {
    return this.teamsService.getTeam(params);
  }

  @Put('update')
  async updateTeam(@Body() args: UpdateTeamInput): Promise<Team> {
    return this.teamsService.updateTeam(args);
  }

  @Delete('delete')
  async deleteTeam(@Body() args: DeleteTeamInput): Promise<boolean> {
    return this.teamsService.deleteTeam(args);
  }
}

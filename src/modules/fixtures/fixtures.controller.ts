import { Controller, Get } from '@nestjs/common';
import { FixturesService } from './fixtures.service';

@Controller()
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Get()
  getHello(): string {
    return this.fixturesService.getHello();
  }
}

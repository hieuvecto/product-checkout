import { Controller, Get } from '@nestjs/common';
import { FeatureService } from './feature.service';

@Controller()
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  getHello(): string {
    return this.featureService.getHello();
  }
}

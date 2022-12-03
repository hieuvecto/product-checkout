import { Injectable } from '@nestjs/common';

@Injectable()
export class FeatureService {
  getHello(): string {
    return 'Hello World!';
  }
}

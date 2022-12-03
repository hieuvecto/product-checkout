import { Injectable } from '@nestjs/common';

@Injectable()
export class FixturesService {
  getHello(): string {
    return 'Hello World!';
  }
}

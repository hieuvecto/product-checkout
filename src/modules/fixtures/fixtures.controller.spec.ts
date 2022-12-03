import { Test, TestingModule } from '@nestjs/testing';
import { FixturesController } from './fixtures.controller';
import { FixturesService } from './fixtures.service';

describe('FeatureController', () => {
  let fixturesController: FixturesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FixturesController],
      providers: [FixturesService],
    }).compile();

    fixturesController = app.get<FixturesController>(FixturesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fixturesController.getHello()).toBe('Hello World!');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

describe('FeatureController', () => {
  let featureController: FeatureController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeatureController],
      providers: [FeatureService],
    }).compile();

    featureController = app.get<FeatureController>(FeatureController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(featureController.getHello()).toBe('Hello World!');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { KarmaController } from './karma.controller';

describe('KarmaController', () => {
  let controller: KarmaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KarmaController],
    }).compile();

    controller = module.get<KarmaController>(KarmaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

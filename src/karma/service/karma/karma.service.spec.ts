import { Test, TestingModule } from '@nestjs/testing';
import { KarmaService } from './karma.service';

describe('KarmaService', () => {
  let service: KarmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KarmaService],
    }).compile();

    service = module.get<KarmaService>(KarmaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

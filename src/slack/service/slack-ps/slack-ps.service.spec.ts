import { Test, TestingModule } from '@nestjs/testing';
import { SlackPsService } from './slack-ps.service';

describe('SlackPsService', () => {
  let service: SlackPsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackPsService],
    }).compile();

    service = module.get<SlackPsService>(SlackPsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

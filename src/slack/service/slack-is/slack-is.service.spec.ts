import { Test, TestingModule } from '@nestjs/testing';
import { SlackIsService } from './slack-is.service';

describe('SlackService', () => {
  let service: SlackIsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackIsService],
    }).compile();

    service = module.get<SlackIsService>(SlackIsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

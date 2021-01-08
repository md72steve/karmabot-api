import { Test, TestingModule } from '@nestjs/testing';
import { BlockKitBuilderService } from './block-kit-builder.service';

describe('BlockKitBuilderService', () => {
  let service: BlockKitBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockKitBuilderService],
    }).compile();

    service = module.get<BlockKitBuilderService>(BlockKitBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

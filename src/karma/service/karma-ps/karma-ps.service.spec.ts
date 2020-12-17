import { Test, TestingModule } from '@nestjs/testing';
import { KarmaPsService } from './karma-ps.service';

describe('KarmaPsService', () => {
  let service: KarmaPsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KarmaPsService],
    }).compile();

    service = module.get<KarmaPsService>(KarmaPsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PagbankService } from './pagbank.service';

describe('PagbankService', () => {
  let service: PagbankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagbankService],
    }).compile();

    service = module.get<PagbankService>(PagbankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

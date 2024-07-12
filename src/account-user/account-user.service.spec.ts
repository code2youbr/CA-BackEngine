import { Test, TestingModule } from '@nestjs/testing';
import { AccountUserService } from './account-user.service';

describe('AccountUserService', () => {
  let service: AccountUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountUserService],
    }).compile();

    service = module.get<AccountUserService>(AccountUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AccountAuthController } from './account-auth.controller';

describe('AccountAuthController', () => {
  let controller: AccountAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountAuthController],
    }).compile();

    controller = module.get<AccountAuthController>(AccountAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

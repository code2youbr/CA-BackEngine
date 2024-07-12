import { Test, TestingModule } from '@nestjs/testing';
import { AccountUserController } from './account-user.controller';

describe('AccountUserController', () => {
  let controller: AccountUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountUserController],
    }).compile();

    controller = module.get<AccountUserController>(AccountUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

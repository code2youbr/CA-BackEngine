import { Module } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { AccountUserController } from './account-user.controller';

@Module({
  providers: [AccountUserService],
  controllers: [AccountUserController]
})
export class AccountUserModule {}

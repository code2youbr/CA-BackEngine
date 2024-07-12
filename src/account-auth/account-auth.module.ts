import { Module } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';

@Module({
  providers: [AccountAuthService],
  controllers: [AccountAuthController]
})
export class AccountAuthModule {}

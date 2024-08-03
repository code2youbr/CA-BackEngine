import { Module } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';
import { AccountAuthModel } from './account-auth.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailModule } from '../email/email.module';
import { AccountUserModule } from '../account-user/account-user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountAuthModel]),
    EmailModule,
    AccountUserModule
  ],
  providers: [AccountAuthService],
  controllers: [AccountAuthController],
  exports: [AccountAuthService],
})
export class AccountAuthModule {}

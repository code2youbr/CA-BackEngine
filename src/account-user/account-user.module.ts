import { Module } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { AccountUserController } from './account-user.controller';
import { AccountUserModel } from './account-user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountAuthModule } from '../account-auth/account-auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountUserModel]),
    AccountAuthModule
  ],
  providers: [AccountUserService],
  controllers: [AccountUserController],
  exports: [AccountUserService]
})
export class AccountUserModule {}

import { Module } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';
import { AccountAuth } from './account-auth.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports:[SequelizeModule.forFeature([AccountAuth])],
  providers: [AccountAuthService],
  controllers: [AccountAuthController],
})
export class AccountAuthModule {}

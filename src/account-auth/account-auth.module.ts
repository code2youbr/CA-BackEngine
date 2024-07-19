import { Module } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';
import { AccountAuthModel } from './account-auth.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([AccountAuthModel])],
  providers: [AccountAuthService],
  controllers: [AccountAuthController],
})
export class AccountAuthModule {}

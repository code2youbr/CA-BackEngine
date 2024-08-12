import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuModel } from './menu.model';
import { AccountUserModule } from '../account-user/account-user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MenuModel]),
    AccountUserModule
  ],
  providers: [MenuService],
  controllers: [MenuController]
})
export class MenuModule {}

import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuModel } from './menu.model';

@Module({
  imports: [SequelizeModule.forFeature([MenuModel])],
  providers: [MenuService],
  controllers: [MenuController]
})
export class MenuModule {}

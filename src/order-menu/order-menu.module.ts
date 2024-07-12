import { Module } from '@nestjs/common';
import { OrderMenuService } from './order-menu.service';
import { OrderMenuController } from './order-menu.controller';

@Module({
  providers: [OrderMenuService],
  controllers: [OrderMenuController]
})
export class OrderMenuModule {}

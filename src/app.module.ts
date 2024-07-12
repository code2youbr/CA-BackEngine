import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account-auth/account-auth.module';
import { AccountUserModule } from './account-user/account-user.module';
import { MenuModule } from './menu/menu.module';
import { OrderMenuModule } from './order-menu/order-menu.module';

@Module({
  imports: [AccountAuthModule, AccountUserModule, MenuModule, OrderMenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

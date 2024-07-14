import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account-auth/account-auth.module';
import { AccountUserModule } from './account-user/account-user.module';
import { MenuModule } from './menu/menu.module';
import { OrderMenuModule } from './order-menu/order-menu.module';
import { AccountAuth } from './account-auth/account-auth.model'; // Importe o modelo

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'db',
      port: 5432,
      username: 'gabriel',
      password: 'gabriel12',
      database: 'cardapio_automatizado',
      autoLoadModels: true,
      synchronize: true,
      models: [AccountAuth, AccountUser],
    }),
    SequelizeModule.forFeature([AccountAuth]),
    AccountAuthModule,
    AccountUserModule,
    MenuModule,
    OrderMenuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

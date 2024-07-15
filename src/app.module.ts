import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account-auth/account-auth.module';
import { AccountUserModule } from './account-user/account-user.module';
import { MenuModule } from './menu/menu.module';
import { OrderMenuModule } from './order-menu/order-menu.module';
import { AccountAuth } from './account-auth/account-auth.model';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Database Host:', process.env.PG_HOST);
console.log('Database Port:', process.env.PG_PORT);
console.log('Database User:', process.env.PG_USER);
console.log('Database Password:', process.env.PG_PASSWORD);
console.log('Database Name:', process.env.PG_DATABASE);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT, 10) || 5432,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      models: [AccountAuth],
      logging: console.log,
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

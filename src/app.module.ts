import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account-auth/account-auth.module';
import { AccountUserModule } from './account-user/account-user.module';
import { MenuModule } from './menu/menu.module';
import { OrderMenuModule } from './order-menu/order-menu.module';
import { EmailModule } from './email/email.module';
import { EmailModel } from './email/email.model';

import * as dotenv from 'dotenv';

dotenv.config();

const customLogger = (msg: string) => {
  // Ignore logs containing specific SQL statements
  if (!msg.includes('SELECT table_name FROM information_schema.tables') &&
    !msg.includes('SELECT i.relname AS name, ix.indisprimary AS primary')) {
    console.log(`Sequelize: ${msg}`);
  }
};

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
      models: [],
      logging: customLogger,
    }),
    EmailModule,
    AccountAuthModule,
    AccountUserModule,
    MenuModule,
    OrderMenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}

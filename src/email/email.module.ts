import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailModel } from '@app/email/email.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([EmailModel])],
  providers: [EmailService]
})
export class EmailModule {}

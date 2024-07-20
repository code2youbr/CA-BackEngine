import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {Md5} from 'ts-md5';
import { AccountAuthModel } from './account-auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { EmailService } from '@app/email/email.service';
import * as crypto from 'crypto';


@Injectable()
export class AccountAuthService {
  constructor(
    @InjectModel(AccountAuthModel) private accountModel: typeof AccountAuthModel,
    readonly emailService: EmailService
  ) {}
  logger = new Logger(AccountAuthService.name);

  generateVerificationCode(): string {
    return crypto.randomBytes(3).toString('hex'); // Gera um código de 6 caracteres em hexadecimal
  }

  private async findByUsernameOrEmail(identifier: string): Promise<AccountAuthModel> {
    return this.accountModel.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
  }

  async createAccount(username: string, password: string, email: string): Promise<void> {
    const account = await this.findByUsernameOrEmail(email);

    if(account){
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }

    await this.accountModel.create({
      username,
      password: Md5.hashStr(password),
      email
    })
  }

  async login(identifier: string, password: string): Promise<boolean> {
    const account =await this.findByUsernameOrEmail(identifier);
    return account.password == Md5.hashStr(password);
  }

  async recoverPassword(email: string): Promise<void> {
    const account = this.accountModel.findOne({
      where:{
        email: email
      }
    })

    if(account){
      await this.emailService.sendMail(email,"Recover password", )
    }


  }
  //todo: method to change password
  // Create a model that can save this number to verify later
}

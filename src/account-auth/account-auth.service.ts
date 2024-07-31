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
    try{
      const account = await this.findByUsernameOrEmail(identifier);
      this.logger.log(account);
      return account.password == Md5.hashStr(password);
    }
    catch(error){
      this.logger.error(error);
      throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
    }
  }

  async sendRecoveryCode(email: string): Promise<void> {
    try{
      const account =await this.findByUsernameOrEmail(email)

      if (account) {
        await this.emailService.sendRefactorCodeMail(email, account);
      }
    }catch{
    throw new HttpException( 'Account not Found', HttpStatus.BAD_REQUEST);
    }
  }
  //todo: method to change password
  // Create a model that can save this number to verify later
}

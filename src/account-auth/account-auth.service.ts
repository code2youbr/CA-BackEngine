import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {Md5} from 'ts-md5';
import { AccountAuthModel } from './account-auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

// noinspection TypeScriptValidateTypes
@Injectable()
export class AccountAuthService {
  constructor(@InjectModel(AccountAuthModel) private accountModel: typeof AccountAuthModel) {
  }
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
    const account =await this.findByUsernameOrEmail(identifier);
    return account.password == Md5.hashStr(password);
  }

  //todo: method to change password
}

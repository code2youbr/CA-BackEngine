// noinspection TypeScriptValidateTypes

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {Md5} from 'ts-md5';
import { AccountAuthModel } from './account-auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, where, WhereOptions } from 'sequelize';


// noinspection TypeScriptValidateTypes
@Injectable()
export class AccountAuthService {
  constructor(@InjectModel(AccountAuthModel) private accountModel: typeof AccountAuthModel) {
  }
  logger = new Logger(AccountAuthService.name);

  async findByUsername(username: string): Promise<AccountAuthModel | null> {
    return this.accountModel.findOne({
      where: {
        username
      }
    });
  }

  async createAccount(username: string, password: string): Promise<void> {
    const account = await this.findByUsername(username);

    if(account){
      throw new HttpException('Account already exists', HttpStatus.NOT_FOUND);
    }

    await this.accountModel.create({
      username,
      password: Md5.hashStr(password)
    })
  }

  async login(username: string, password: string): Promise<boolean> {
    const account = await this.accountModel.findOne({
      where:{
        username: username,

      }
    });
    return true
  }
}
//todo usar o MD5 para codificar a senha.
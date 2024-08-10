import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountUserModel } from './account-user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AccountAuthModel } from '../account-auth/account-auth.model';
import { AccountAuthService } from '../account-auth/account-auth.service';
import { Md5 } from 'ts-md5';

@Injectable()
export class AccountUserService {
  constructor(
    @InjectModel(AccountUserModel) private accountModel: typeof AccountUserModel,
    private readonly accountAuthService: AccountAuthService,
    ) {}

  async getAccountUser(email: string): Promise<AccountUserModel> {
    return await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {
        email: email,
      },
      include: [
        {
          model: AccountAuthModel,
          as: 'accountUserId',
        },
      ],
    });
  }

  async createAccountUser(username: string, password: string ,email: string, cpfCnpj: string): Promise<void> {
     await this.accountModel.create({
      name: username,
      email: email,
      cpfCnpj: cpfCnpj
    })
    await this.accountAuthService.createPassword(password, email)

  }

  async updateAccountUser(email: string, newEmail?: string, telephoneNumber?:number ): Promise<void> {
    const account = await this.getAccountUser(email)
    if(account){
      const updateData: any = {};

      if (newEmail !== undefined) {
        updateData.email = newEmail;
      }

      if (telephoneNumber !== undefined) {
        updateData.telephoneNumber = telephoneNumber;
      }

      await account.update(updateData);
    }
  }

  async deactivateAccount(email: string, password: string, ): Promise<void> {
    const account = await this.accountModel.findOne({rejectOnEmpty: undefined,where: {email: email}});
    if(account.accountUserId.password == Md5.hashStr(password)){
      await account.update({
        isDeleted: true,
      })
      return
    }
    throw new HttpException('fail to deactivate account', HttpStatus.BAD_REQUEST);

  }


}
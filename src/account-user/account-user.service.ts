import { Injectable } from '@nestjs/common';
import { AccountUserModel } from './account-user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AccountAuthModel } from '../account-auth/account-auth.model';

@Injectable()
export class AccountUserService {
  constructor(@InjectModel(AccountUserModel) private accountModel: typeof AccountUserModel) {
  }

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

  async createAccountUser(username: string ,email: string): Promise<AccountUserModel> {
    return await this.accountModel.create({
      name: username,
      email: email,
    })
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


}
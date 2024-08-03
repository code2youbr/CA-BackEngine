import { Injectable } from '@nestjs/common';
import { AccountUserModel } from './account-user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AccountAuthModel } from '../account-auth/account-auth.model';

@Injectable()
export class AccountUserService {
  constructor(@InjectModel(AccountUserModel) private accountModel: typeof AccountUserModel) {
  }

  //todo: Criar table para armazenar: idade, cpf, endereço, telefone
  // criar serviço para alterar
  async getAccountUser(email: string): Promise<AccountUserModel> {
    return await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {
        email: email,
      },
      include: [
        {
          model: AccountAuthModel,
          as: 'accountAuth',
        },
      ],
    });
  }
}
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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

  logger = new Logger(AccountUserService.name);

  async getAccountUserByEmail(email: string): Promise<any> {
    const account = await this.accountModel.findOne({
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
    return JSON.stringify(account, null, 2);
  }

  async getAccountUserById(UserId: number){
    return this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {
        id: UserId
      }
    })
  }

  async createAccountUser(username: string, password: string ,email: string, telephone: string , cpfCnpj: string, isLegalPerson): Promise<void> {
    const account = await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {cpfCnpj: cpfCnpj}
    });

    if(!account){
      const newAccount = await this.accountModel.create({
        name: username,
        email: email,
        cpfCnpj: cpfCnpj,
        telephoneNumber: telephone,
        isLegalPerson: isLegalPerson,
      })
      if(newAccount){
        await this.accountAuthService.createPassword(password, newAccount.id)
      }
    }
  }

  //todo: trocar isso assim que o antonio responder, usar o cpf para ser o identificador
  async updateAccountUser(email: string, name: string, newEmail?: string, telephoneNumber?:number ): Promise<void> {
    const account = await this.getAccountUserByEmail(email)
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
    const account = await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {
        email: email
      }
    });

    if(account.accountAuth.password == Md5.hashStr(password)){
      await account.update({
        isDeleted: true,
      })
      return
    }
    throw new HttpException('fail to deactivate account', HttpStatus.BAD_REQUEST);
  }

  //todo: create a controller to this function
  async addAdmin(email:string, newAdminEmail:string): Promise<void> {
    const account = await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: { email: email }
    });

    if(account.isAdmin){
      const newAccount = await this.accountModel.findOne({
        rejectOnEmpty: undefined,
        where: {email: newAdminEmail}
      });

      if(newAccount){
      newAccount.isAdmin = true;
      return
      }
      throw new HttpException('fail to add admin, account not exist', HttpStatus.BAD_REQUEST);
    }

    throw new HttpException('User dont have privilege', HttpStatus.UNAUTHORIZED)
  }

  //todo: create a controller to this function
  async removeAdmin(currentAdminEmail: string, targetAdminEmail: string): Promise<void> {
    const currentAdminAccount = await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: { email: currentAdminEmail }
    });

    if (currentAdminAccount.isAdmin) {
      const targetAdminAccount = await this.accountModel.findOne({
        rejectOnEmpty: undefined,
        where: { email: targetAdminEmail }
      });

      if (targetAdminAccount) {
        targetAdminAccount.isAdmin = false;
        return;
      }
      throw new HttpException('Failed to remove admin, account does not exist', HttpStatus.BAD_REQUEST);
    }

    throw new HttpException('User does not have the necessary privileges', HttpStatus.UNAUTHORIZED);
  }


}
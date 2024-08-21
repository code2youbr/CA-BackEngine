import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountUserModel } from './account-user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AccountAuthModel } from '../account-auth/account-auth.model';
import { AccountAuthService } from '../account-auth/account-auth.service';
import { Md5 } from 'ts-md5';
import { Address } from './interface/address';
import { Op } from 'sequelize';

@Injectable()
export class AccountUserService {
  constructor(
    @InjectModel(AccountUserModel) private accountModel: typeof AccountUserModel,
    private readonly accountAuthService: AccountAuthService,
    ) {}

  logger = new Logger(AccountUserService.name);

  async getAccountUserByCpfCnpj(cpfCnpj: string): Promise<AccountUserModel> {
    return await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {
        cpfCnpj: cpfCnpj,
      },
      include: [
        {
          model: AccountAuthModel,
          as: 'accountUserId',
        },
      ],
    });
  }

  async getAccountUserById(UserId: number){
    return this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: {
        id: UserId
      }
    })
  }

  async createAccountUser(username: string, password: string ,email: string, telephone: string , cpfCnpj: string, isLegalPerson: boolean, address: Address): Promise<void> {
    const existingAccount = await this.accountModel.findOne({
      where: {
        [Op.or]: [
          { cpfCnpj: cpfCnpj },
          { email: email },
          { telephoneNumber: telephone }
        ]
      }
    });

    if (existingAccount) {
      if (existingAccount.cpfCnpj === cpfCnpj) {
        throw new HttpException('Account with this CPF/CNPJ already exists', HttpStatus.BAD_REQUEST);
      }
      if (existingAccount.email === email) {
        throw new HttpException('Account with this email already exists', HttpStatus.BAD_REQUEST);
      }
      if (existingAccount.telephoneNumber === telephone) {
        throw new HttpException('Account with this telephone number already exists', HttpStatus.BAD_REQUEST);
      }
    }

    const newAccount = await this.accountModel.create({
      name: username,
      email: email,
      cpfCnpj: cpfCnpj,
      telephoneNumber: telephone,
      isLegalPerson: isLegalPerson,
      address
    })
    if(newAccount){
      await this.accountAuthService.createPassword(password, newAccount.id)
    }
  }

  async updateAccountUser(cpfCnpj: string, email?: string, name?: string, telephoneNumber?:number ): Promise<void> {
    const account = await this.getAccountUserByCpfCnpj(cpfCnpj)
    if(account){
      const updateData: any = {};

      if (email !== undefined) {
        updateData.email = email;
      }

      if (telephoneNumber !== undefined) {
        updateData.telephoneNumber = telephoneNumber;
      }

      if (name !== undefined) {
        updateData.name = name;
      }

      await account.update(updateData);
    }
  }

  async changeAddress(address: Address): Promise<void> {}

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

  async addAdmin(currentAdminEmail: string, newAdminEmail:string): Promise<void> {
    const account = await this.accountModel.findOne({
      rejectOnEmpty: undefined,
      where: { email: currentAdminEmail }
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
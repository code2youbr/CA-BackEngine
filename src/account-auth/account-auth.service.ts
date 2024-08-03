import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {Md5} from 'ts-md5';
import { AccountAuthModel } from './account-auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { EmailService } from '../email/email.service';
import { AccountUserService } from '../account-user/account-user.service';


@Injectable()
export class AccountAuthService {
  constructor(
    @InjectModel(AccountAuthModel) private accountModel: typeof AccountAuthModel,
    readonly emailService: EmailService,
    readonly accountUserService: AccountUserService,
  ) {}
  logger = new Logger(AccountAuthService.name);

  private async findByEmail(email: string) {
    return this.accountUserService.getAccountUser(email)
  }
  async createAccount(username: string, password: string, email: string): Promise<void> {
    const account = await this.findByEmail(email);

    if(account){
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }

    //todo criar account
    const newAccount = await this.accountUserService.createAccountUser(username, email)
    if(newAccount){
      await this.accountModel.create({
        password: Md5.hashStr(password),
        accountUserId: newAccount.id,
      })
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try{
      const account = await this.findByEmail(email);
      return account.accountUserId.password == Md5.hashStr(password);
    }
    catch(error){
      throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
    }
  }

  async sendRecoveryCode(email: string): Promise<void> {
    try{
      const account =await this.findByEmail(email)

      if (account) {
        await this.emailService.sendRefactorCodeMail(email, account.accountUserId);
      }
    }catch{
    throw new HttpException( 'Account not Found', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(newPassword: string, email:string, refactorCode:number): Promise<void> {
    const account = await this.findByEmail(email);
    if(!account){
      throw new HttpException('Account not Found', HttpStatus.BAD_REQUEST);
    }
    const verifiedCode = await this.emailService.verifyCode(account.accountUserId, refactorCode);
    if(verifiedCode){
      await account.update({
        password: newPassword,
      })
      return
    }
    throw new HttpException('refactor code does not match in database', HttpStatus.BAD_REQUEST);
  }

  async deactivateAccount(email: string, password: string, ): Promise<void> {
    const account = await this.findByEmail(email);
    if(account.accountUserId.password == Md5.hashStr(password)){
      await account.update({
        isDeleted: true,
      })
      return
    }
    throw new HttpException('fail to deactivate account', HttpStatus.BAD_REQUEST);

  }


}

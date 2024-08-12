import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {Md5} from 'ts-md5';
import { AccountAuthModel } from './account-auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { EmailService } from '../email/email.service';
import { AccountUserService } from '../account-user/account-user.service';
import { AccountUserModel } from '../account-user/account-user.model';


@Injectable()
export class AccountAuthService {
  constructor(
    @InjectModel(AccountAuthModel) private accountAuthModel: typeof AccountAuthModel,
    readonly emailService: EmailService,
    readonly accountUserService: AccountUserService,
  ) {}
  logger = new Logger(AccountAuthService.name);

  private async findByEmail(email: string) {
    return this.accountUserService.getAccountUserByEmail(email)
  }

  async createPassword( password: string, email: string): Promise<void> {
    const account =await this.findByEmail(email)

    if(account){
      await this.accountAuthModel.create({
        password: Md5.hashStr(password),
        accountUserId: account.id,
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
      //get the old password to change
      const userPassword = await this.accountAuthModel.findOne({
        rejectOnEmpty: undefined,
        where: {accountUserId: account.id},
      })

      if(userPassword){
        await userPassword.update({
          password: newPassword,
        })
        return
      }
      throw new HttpException('user password dont exist', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('refactor code does not match in database', HttpStatus.BAD_REQUEST);
  }




}

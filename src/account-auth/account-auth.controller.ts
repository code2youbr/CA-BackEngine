import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query, Req, Res } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { CreateDto } from '../account-user/Dto/CreateDto';
import { AccessDto } from './Dto/AccessDto';
import { SendCodeDto } from './Dto/sendCodeDto';
import { UpdadeDto } from './Dto/updadeDto';
import { DeleteDto } from '../account-user/Dto/deleteDto';

@Controller('account-auth')
export class AccountAuthController {
  constructor(readonly service: AccountAuthService) {
  }
  logger = new Logger(AccountAuthController.name);

  @Post('login')
  async loginAccount(@Body() accessDto: AccessDto){
    try{
      const {email, password} = accessDto;
      return await this.service.login(email, password);
    }
    catch(error){
      this.logger.error(error);
    }
  }

  @Post('sendCode')
  async sendCode(@Body() sendCodeDto :SendCodeDto):Promise<string> {
    try{
      const { email } = sendCodeDto;
      await this.service.sendRecoveryCode(email)
      return 'ok';
    }catch(error){
      this.logger.error(error);
      throw HttpStatus.BAD_REQUEST;
    }
  }

  @Post('changePassword')
  async changePassword(@Body() newPassword: string, email:string, refactorCode:number):Promise<string>{
    try {
      await this.service.changePassword(newPassword, email, refactorCode);
      return 'ok';
    }catch(error){
      this.logger.error(error);
      throw HttpStatus.BAD_REQUEST;
    }
  }

}

import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { CreateAndAccessDto } from './types/CreateAndAccessDto';
import { AccessDto } from '@app/account-auth/types/AccessDto';

@Controller('account-auth')
export class AccountAuthController {
  constructor(readonly service: AccountAuthService) {
  }
  logger = new Logger(AccountAuthController.name);

  @Post('create')
  async createAccount(@Body() createDto: CreateAndAccessDto):Promise<string> {
    const { username, password, email } = createDto;
    await this.service.createAccount(username, password, email);
    return 'ok';
  }

  @Post('login')
  async loginAccount(@Body() accessDto: AccessDto){
    try{
      const {identifier, password} = accessDto;
      return await this.service.login(identifier, password);
    }
    catch(error){
      this.logger.error(error);
    }
  }

  @Post('update')
  async changePassword(@Body() email:string):Promise<string> {
    try{
      await this.service.recoverPassword(email)
      return 'ok';
    }catch(error){
      this.logger.error(error);
      throw HttpStatus.BAD_REQUEST;
    }
  }

}

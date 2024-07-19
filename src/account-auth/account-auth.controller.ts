import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { CreateAndAccessDto } from './types/CreateAndAccessDto';

@Controller('account-auth')
export class AccountAuthController {
  constructor(readonly service: AccountAuthService) {
  }
  logger = new Logger(AccountAuthController.name);

  @Post('create')
  async createAccount(@Body() createDto: CreateAndAccessDto):Promise<string> {
    try{
      const { username, password } = createDto;
      await this.service.createAccount(username, password);
      return 'ok';
    }
    catch(e){
      this.logger.error(e);
      throw new HttpException('Failed to create account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async loginAccount(@Body() accessDto: CreateAndAccessDto){
    const { username, password } = accessDto;
    return await this.service.login(username, password);
  }

  @Post('update')

}

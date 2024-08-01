import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { CreateAndAccessDto } from './Dto/CreateAndAccessDto';
import { AccessDto } from './Dto/AccessDto';
import { SendCodeDto } from './Dto/sendCodeDto';
import { UpdadeDto } from './Dto/updadeDto';
import { DeleteDto } from './Dto/deleteDto';

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

  @Post('updatePassword')
  async updatePassword(@Body() updateDto: UpdadeDto):Promise<string> {
    try{
      const { newPassword, email, refactorCode } = updateDto;
      await this.service.changePassword(newPassword, email, refactorCode);
      return 'ok';
    }catch (e){
      throw new HttpException('Error changing password', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('delete')
  async deleteAccount(@Body() deleteDto: DeleteDto):Promise<string>{
    try{
      const { email, password } = deleteDto;
      await this.service.deactivateAccount(email, password);
      return 'ok';
    }catch(e){
      throw new HttpException('Error deleting account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

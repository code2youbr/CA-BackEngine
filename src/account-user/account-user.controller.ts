import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { UpdateDto } from './Dto/updateDto'

@Controller('account-user')
export class AccountUserController {

  constructor(private readonly service: AccountUserService) {}

  //TODO: bring create and delete from account-auth to here

  @Post('updatePassword')
  async updatePassword(@Body() updateDto: UpdateDto):Promise<string> {
    try{
      const { email, telephoneNumber, newEmail } = updateDto;
      await this.service.updateAccountUser(email, newEmail, telephoneNumber);
      return 'ok'
    }catch (e){
      throw new HttpException('Error updating profile', HttpStatus.BAD_REQUEST);
    }
  }
}

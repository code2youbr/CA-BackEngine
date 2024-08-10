import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { UpdateDto } from './Dto/updateDto'
import { CreateDto } from '../account-auth/Dto/CreateDto';
import { validateCnpj } from '../shared/helpers/validate-cnpj';
import { validateCPF } from '../shared/helpers/validate-cpf';
import { DeleteDto } from '../account-auth/Dto/deleteDto';

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

  @Post('create')
  async createAccount(@Body() createDto: CreateDto):Promise<string> {
    const { name, password, email, cpfCnpj, isLegalPerson } = createDto;

    if (isLegalPerson) {
      if (!validateCnpj(cpfCnpj)) {
        throw new HttpException('Invalid CNPJ.', HttpStatus.BAD_REQUEST)
      }
    }

    if (!validateCPF(cpfCnpj)) {
      throw new HttpException('Invalid CPF.', HttpStatus.BAD_REQUEST)
    }
    const clearCpfCnpj = cpfCnpj.replace(/[^\d]/g, '')

    await this.service.createAccountUser(name, password, email, clearCpfCnpj);
    return 'ok';
  }

  @Post('deactivateAccount')
  async deactivateAccount(@Body() deleteDto: DeleteDto):Promise<string> {
    const { email, password } = deleteDto;
    await this.service.deactivateAccount(email, password)
  }

}

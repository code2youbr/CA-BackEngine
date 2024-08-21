import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { UpdateDto } from './Dto/updateDto'
import { CreateDto } from './Dto/createDto';
import { validateCnpj } from '../shared/helpers/validate-cnpj';
import { validateCPF } from '../shared/helpers/validate-cpf';
import { DeleteDto } from './Dto/deleteDto';
import { AdminManagement } from './Dto/adminManagement';
import { Address } from './interface/address';
import { ChangeAddressDto } from './Dto/changeAddressDto';

@Controller('account-user')
export class AccountUserController {

  constructor(private readonly service: AccountUserService) {}


  @Post('updateAccount')
  async updateAccount(@Body() updateDto: UpdateDto):Promise<string> {
    try{
      const { email, telephoneNumber, newEmail } = updateDto;
      await this.service.updateAccountUser(email, newEmail, telephoneNumber);
      return 'ok'
    }catch (e){
      throw new HttpException('Error updating profile', HttpStatus.BAD_REQUEST);
    }
  }
  logger = new Logger('AccountUserController');

  @Post('create')
  async createAccount(@Body() createDto: CreateDto):Promise<string> {
    const { name, password, email, cpfCnpj, telephone, isLegalPerson, address } = createDto;
    if (isLegalPerson) {
      if (!validateCnpj(cpfCnpj)) {
        throw new HttpException('Invalid CNPJ.', HttpStatus.BAD_REQUEST)
      }
    }

    if (!validateCPF(cpfCnpj)) {
      throw new HttpException('Invalid CPF.', HttpStatus.BAD_REQUEST)
    }
    const clearCpfCnpj = cpfCnpj.replace(/[^\d]/g, '')

    await this.service.createAccountUser(name, password, email, telephone, clearCpfCnpj, isLegalPerson, address );
    return 'ok';
  }


  @Post('changeAddress')
  async changeAddress(@Body() changeAddressDto: ChangeAddressDto):Promise<string> {
    const { address } = changeAddressDto

    return 'ok'
  }
  @Post('deactivateAccount')
  async deactivateAccount(@Body() deleteDto: DeleteDto):Promise<string> {
    const { email, password } = deleteDto;
    await this.service.deactivateAccount(email, password)
    return 'ok'
  }

  @Post('addAdmin')
  async addAdmin(@Body() adminManagement: AdminManagement): Promise<string> {
    const { currentAdminEmail, targetAdminEmail} = adminManagement;

    await this.service.addAdmin(currentAdminEmail, targetAdminEmail)

    return 'ok';
  }

  @Post('removeAdmin')
  async removeAdmin(@Body() adminManagement: AdminManagement): Promise<string> {
    const { currentAdminEmail, targetAdminEmail} = adminManagement;

    await this.service.removeAdmin(currentAdminEmail, targetAdminEmail)

    return 'ok';
  }

}

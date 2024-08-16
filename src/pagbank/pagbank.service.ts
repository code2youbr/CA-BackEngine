import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { OrderRequest } from './Interface/createOrder';
import { AccountUserService } from '../account-user/account-user.service';
import { MenuService } from '../menu/menu.service';
import { splitPhoneNumber } from '../shared/helpers/splitNumber';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PagbankService {
  constructor(
    private accountUserService: AccountUserService,
    private menuService: MenuService,
    private httpService: HttpService,
  ) {}

  private readonly logger = new Logger(PagbankService.name)



  async createOrder(foodIdentifiers: string[], quantities: number[], cpfCnpj: string): Promise<OrderRequest | undefined> {
    const account = await this.accountUserService.getAccountUserByCpfCnpj(cpfCnpj)

    if(!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const items = [];
    for (let i = 0; i < foodIdentifiers.length; i++) {
      const foodDetails = await this.menuService.getMealInformation(foodIdentifiers[i]);

      if (!foodDetails) {
        throw new HttpException(`Meal with identifier ${foodIdentifiers[i]} not found`, HttpStatus.NOT_FOUND);
      }

      items.push({
        reference_id: foodDetails.identifier,
        name: foodDetails.name,
        quantity: quantities[i],
        unit_amount: foodDetails.price,
      });
    }

    const url = `/order`
    const body = {
      reference_id: foodIdentifiers.join('-'),
      customer: {
        name: account.name,
        email: account.email,
        tax_id: account.cpfCnpj,
        phones: splitPhoneNumber(account.telephoneNumber),
      },
      items: items,
      shipping:{
      street: account.address.street ,
        number: account.address.number ,
        complement:  account.address.complement | undefined,
      city:  account.address.city,
      region_code: account.address.region_code,
      country: account.address.country ,
      postal_code: account.address.postal_code
      },
    }

    try {
      const response = await this.httpService.axiosRef.post<OrderRequest>(url, body);
      return response.data;

    }catch (error) {
      this.logger.error(error)
      return undefined
    }

  }

  async paymentOrderPix(){

  }

  async paymentOrderCreditCard(){

  }

  async paymentOrderDebitCard(){

  }

  async createOrderGooglePay(){}

  async paymentOrderGooglePay(){}
}


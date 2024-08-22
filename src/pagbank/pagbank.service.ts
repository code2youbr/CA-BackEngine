import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { OrderRequest } from './dto/createOrder';
import { AccountUserService } from '../account-user/account-user.service';
import { MenuService } from '../menu/menu.service';
import { splitPhoneNumber } from '../shared/helpers/splitNumber';
import { HttpService } from '@nestjs/axios';
import { getFormattedExpirationDate } from '../shared/helpers/getFormattedExpirationDate';
import { InjectModel } from '@nestjs/sequelize';
import { PagBankModel } from './pagbank.model';
import { PaymentMethod, PaymentRequest, PaymentType } from './dto/PaymentOrder';
import { AccountUserModel } from '../account-user/account-user.model';
import { CreateOrderResponse } from './Interface/createOrderResponse';
import { PaymentOrderResponse } from './Interface/paymentOrderResponse';

@Injectable()
export class PagbankService {
  constructor(
    @InjectModel(PagBankModel) private pagBankModel: typeof PagBankModel,
    private accountUserService: AccountUserService,
    private menuService: MenuService,
    private httpService: HttpService,
  ) {}

  private readonly logger = new Logger(PagbankService.name)

  async generateUniqueIdentifier(): Promise<string> {
    const lastItem = await this.pagBankModel.findOne({
      order: [['id', 'DESC']]
    });

    let nextId = 1;

    if (lastItem) {
      const lastIdentifier = lastItem.identifier;
      const numericPart = parseInt(lastIdentifier.split('-')[1], 10);
      nextId = numericPart + 1;
    }

    const paddedId = nextId.toString().padStart(8, '0');
    return `ORD-${paddedId}`;
  }


  //this method need trigger when the user close the shopping cart, then in that response will have the code that we need to use in payingOrder
  //first we need send the food identifier like { EX-0001, EX-0010 } and the quantities { 2 , 1 }, so will have 2 EX-0001 and 1 EX-0010
  //for pix payment method, just this function will resolve
  async createOrder(foodIdentifiers: string[], quantities: number[], cpfCnpj: string): Promise<CreateOrderResponse | undefined> {
    const account = await this.accountUserService.getAccountUserByCpfCnpj(cpfCnpj)

    if(!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const items = [];
    let totalAmount = 0;

    for (let i = 0; i < foodIdentifiers.length; i++) {
      const foodDetails = await this.menuService.getMealInformation(foodIdentifiers[i]);

      if (!foodDetails) {
        throw new HttpException(`Meal with identifier ${foodIdentifiers[i]} not found`, HttpStatus.NOT_FOUND);
      }

      const itemTotal = foodDetails.price * quantities[i];

      items.push({
        reference_id: foodDetails.identifier,
        name: foodDetails.name,
        quantity: quantities[i],
        unit_amount: foodDetails.price,
        item_total: itemTotal
      });

      totalAmount += itemTotal;
    }


    const url = `/order`
    const body = {
      reference_id: await this.generateUniqueIdentifier(),
      customer: {
        name: account.name,
        email: account.email,
        tax_id: account.cpfCnpj,
        phones: splitPhoneNumber(account.telephoneNumber),
      },
      items: items,
      shipping:{
      street: account.address.street,
      number: account.address.number,
      complement:  account.address.complement,
      city:  account.address.city,
      region_code: account.address.region_code,
      country: account.address.country ,
      postal_code: account.address.postal_code
      },
      qr_codes: {
        amount: totalAmount,
        //will expire 1 hour later
        expiration_date: getFormattedExpirationDate()
      }
    }

    try {
      const response = await this.httpService.axiosRef.post<CreateOrderResponse>(url, body);

      await this.pagBankModel.create({
        pagbankId: response.data.id,
        orderInfo: {
          totalAmount: totalAmount,
          foodIdentifiers: foodIdentifiers.join('-'),
        },
        identifier: response.data.reference_id,
      })

      //here will send to front end the order id, need come back to pay
      return response.data;

    }catch (error) {
      this.logger.error(error)
      return undefined
    }
  }

  //todo: finalize this method
  async paymentWithSaveCreditCard(orderId: string, cvv: string):Promise <PaymentOrderResponse>{
    const { installments, soft_descriptor, card } = payment
    const order = await this.pagBankModel.findOne({
      rejectOnEmpty: undefined,
      where:{
        orderId: orderId,
      },
      include: [{
        model: AccountUserModel,
        as: 'user'
      }]
    });

    const url = `/orders/${orderId}/pay`
    const body = {
      charges: [{
        reference_id: order.identifier,
        description: `payment of ${order.orderInfo.foodIdentifiers}`,
        amount:{
          value: order.orderInfo.totalAmount,
          currency: 'BRL'
        },
        payment_method: {
          type: "CREDIT_CARD",
          installments: installments,
          capture: true,
          soft_descriptor: soft_descriptor,
          card: {
            id: order.user.cardPagBankToken,
            security_code: cvv
          },
        }
      }]
    }

    try {
      const response = await this.httpService.axiosRef.post<PaymentOrderResponse>(url, body);

      await this.

        return response.data.reference_id;

    }catch (error) {
      this.logger.error(error)
      return undefined
    }

  }

  async paymentOrderCreditCard(orderId: string, payment: PaymentMethod,): Promise<PaymentOrderResponse> {
    const { installments, soft_descriptor, card } = payment
    const order = await this.pagBankModel.findOne({
      rejectOnEmpty: undefined,
      where:{
        orderId: orderId,
      },
      include: [{
        model: AccountUserModel,
        as: 'user'
      }]
    });

    const url = `/orders/${orderId}/pay`
    const body = {
      charges: [{
        reference_id: order.identifier,
        description: `payment of ${order.orderInfo.foodIdentifiers}`,
        amount:{
          value: order.orderInfo.totalAmount,
          currency: 'BRL'
        },
        payment_method: {
          type: "CREDIT_CARD",
          installments: installments,
          capture: true,
          soft_descriptor: soft_descriptor,
          card: card
        }
      }]
    }


    try {
      const response = await this.httpService.axiosRef.post<PaymentOrderResponse>(url, body);

      //todo: create function that can save the card token
      if(card.store){
        await this.accountUserService.savePagBankToken(response.data.paymeny)
      }

      return response.data.reference_id;

    }catch (error) {
      this.logger.error(error)
      return undefined
    }

  }

  async paymentOrderDebitCard(orderId: string, card: PaymentMethod):Promise <PaymentOrderResponse>{
    const order = await this.pagBankModel.findOne({
      rejectOnEmpty: undefined,
      where:{
        orderId: orderId,
      },
      include: [{
        model: AccountUserModel,
        as: 'user'
      }]
    });


  }


  //todo: search and integrate this method
  async createOrderGooglePay(){
    //a
  }

  async paymentOrderGooglePay(){
    //a
  }
}


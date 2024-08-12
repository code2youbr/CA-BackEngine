import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MenuModel } from './menu.model';
import { AccountUserService } from '../account-user/account-user.service';

@Injectable()
export class MenuService {

  constructor(
    @InjectModel(MenuModel) private menuModel: typeof MenuModel,
    private readonly accountUserService: AccountUserService,
  ) {}


  async userVerification(UserId: number):Promise <boolean>{
    const account = await this.accountUserService.getAccountUserById(UserId)
    return account.isAdmin !== false;
  }

  async getAllMeals():Promise <MenuModel[]> {
    return this.menuModel.findAll()
  }

  async createMeal(name:string, description:string ,image:string ,price:number , available: boolean, userId: number){
    const valid = await this.userVerification(userId)

    if(valid){
      const existingMenu = await this.menuModel.findOne({
        rejectOnEmpty: undefined,
        where: {name: name}
      })

      if (existingMenu) {
        throw new HttpException("already exist a meal with this name", HttpStatus.BAD_REQUEST);
      }

      await this.menuModel.create({
        name,
        description,
        image,
        price,
        available,
      })
      return
    }

    throw new HttpException('User dont have privilege', HttpStatus.UNAUTHORIZED)
  }

  async updateMeal(name:string, newName: string, description:string, image:string, price:number, available:boolean, userId:number ){
    const valid = await this.userVerification(userId)

    if(valid) {
      const existingMenu = await this.menuModel.findOne({
        rejectOnEmpty: undefined,
        where: { name: name },
      });

      if (existingMenu) {
        if (newName !== undefined) {
          existingMenu.name = newName;
        }

        if (description !== undefined) {
          existingMenu.description = description;
        }

        if (image !== undefined) {
          existingMenu.image = image;
        }

        if (price !== undefined) {
          existingMenu.price = price;
        }

        if (available !== true) {
          existingMenu.available = false;
        }
      }
      return
    }
    throw new HttpException('User dont have privilege', HttpStatus.UNAUTHORIZED)

  }

  async removeMeal(name: string, userId: number){
    const valid = await this.userVerification(userId)
    if(valid) {
      const existingMenu = await this.menuModel.findOne({
        rejectOnEmpty: undefined,
        where: { name: name },
      })

      if (existingMenu) {
        await existingMenu.destroy()
      }
      return
    }
    throw new HttpException('User dont have privilege', HttpStatus.UNAUTHORIZED)
  }
}

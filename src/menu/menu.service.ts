import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MenuModel } from './menu.model';
import { CreateMenuDto } from './dto/createMenuDto';
import { deleteMenuDto } from './dto/deleteMenuDto';

@Injectable()
export class MenuService {
  constructor(@InjectModel(MenuModel) private menuModel: typeof MenuModel) {}


  async createMeal(createMenuDto: CreateMenuDto){
    const { name, description,price, available } = createMenuDto;
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
      price,
      available,
    })
  }

  async updateMeal(createMenuDto: CreateMenuDto){
    const { name, description, price, available } = createMenuDto;
    const existingMenu = await this.menuModel.findOne({
      rejectOnEmpty: undefined,
      where: {name: name}
    })
    //todo: terminanr assim que me for respondido
    if (existingMenu) {

    }
  }

  async removeMeal(deleteMenuDto: deleteMenuDto){
    const { name } = deleteMenuDto;
    const existingMenu = await this.menuModel.findOne({
      rejectOnEmpty: undefined,
      where: {name: name}
    })

    if (existingMenu) {
      await existingMenu.destroy()
    }
  }

}
//TODO: create service to save by
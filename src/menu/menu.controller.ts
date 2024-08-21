import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuModel } from './menu.model';
import { CreateMenuDto } from './dto/createMenuDto';
import { UpdateMenuDto } from './dto/updateMenuDto';
import { DeleteMenuDto, deleteMenuDto } from './dto/deleteMenuDto';

@Controller('menu')
//todo: criar controller
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  logger = new Logger(MenuController.name);

  @Get("allMeal")
  async allMeal(): Promise<MenuModel[]> {
    return this.menuService.getAllMeals()
  }

  @Get(':foodIdentifier')
  async getMealInformation(@Param('foodIdentifier') foodIdentifier: string): Promise<MenuModel> {
    try {
      const meal = await this.menuService.getMealInformation(foodIdentifier)

      if (!meal) {
        throw new HttpException('Meal not found', HttpStatus.NOT_FOUND);
      }

      return meal;

    } catch (error) {
      throw new HttpException('Failed to retrieve meal information', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('createMeal')
  async createMeal(@Body() createMenuDto: CreateMenuDto){
    try {
      const { name, description, image, price, available, UserId } = createMenuDto;
      await this.menuService.createMeal(name, description, image, price, available, UserId);
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Failed to create meal', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('updateMeal')
  async updateMeal(@Body() updateMenuDto: UpdateMenuDto):Promise<string> {
    const { name, newName ,description, image, price, available, UserId } = updateMenuDto;
    await this.menuService.updateMeal(name, newName, description, image, price, available, UserId)
    return 'ok'
  }

  @Delete('deleteMeal')
  async deleteMeal(@Body() deleteMenuDto: DeleteMenuDto):Promise<string> {
    try {
      const { foodIdentifier, userId } = deleteMenuDto;
      await this.menuService.removeMeal(foodIdentifier, userId);
      return 'ok'
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Failed to delete meal', HttpStatus.BAD_REQUEST);
    }
  }



}



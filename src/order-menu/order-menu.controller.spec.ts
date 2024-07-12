import { Test, TestingModule } from '@nestjs/testing';
import { OrderMenuController } from './order-menu.controller';

describe('OrderMenuController', () => {
  let controller: OrderMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderMenuController],
    }).compile();

    controller = module.get<OrderMenuController>(OrderMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

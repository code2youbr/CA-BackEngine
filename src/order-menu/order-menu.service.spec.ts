import { Test, TestingModule } from '@nestjs/testing';
import { OrderMenuService } from './order-menu.service';

describe('OrderMenuService', () => {
  let service: OrderMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderMenuService],
    }).compile();

    service = module.get<OrderMenuService>(OrderMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

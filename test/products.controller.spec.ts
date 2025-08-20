import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            seed: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('getProducts calls service.findAll and returns products', async () => {
    const products = [
      { id: 1, name: 'P1', priceInCents: 1000, stock: 5 },
    ];
    (service.findAll as jest.Mock).mockResolvedValue(products);
    const result = await controller.getProducts();
    expect(result).toEqual(products);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('seedProducts calls service.seed and returns seeded products', async () => {
    const dto = { count: 1, withStock: true };
    const seeded = [{ id: 1, name: 'P1', priceInCents: 1000, stock: 5 }];
    (service.seed as jest.Mock).mockResolvedValue(seeded);
    const result = await controller.seedProducts(dto as any);
    expect(result).toEqual(seeded);
    expect(service.seed).toHaveBeenCalledWith(dto);
  });
});
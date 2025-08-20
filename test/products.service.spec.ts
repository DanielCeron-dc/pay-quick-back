import { ProductsService } from '../src/products/products.service';

describe('ProductsService', () => {
  let prisma: any;
  let service: ProductsService;

  beforeEach(() => {
    // stub PrismaService with minimal product methods
    prisma = {
      product: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };
    service = new ProductsService(prisma);
  });

  it('findAll returns all products', async () => {
    const products = [
      { id: 1, name: 'P1', priceInCents: 1000, stock: 5 },
      { id: 2, name: 'P2', priceInCents: 2000, stock: 3 },
    ];
    prisma.product.findMany.mockResolvedValue(products);
    const result = await service.findAll();
    expect(result).toEqual(products);
    expect(prisma.product.findMany).toHaveBeenCalled();
  });

  it('seed creates the requested number of products', async () => {
    const created: any[] = [];
    prisma.product.create.mockImplementation(({ data }: any) => {
      created.push(data);
      return Promise.resolve(data);
    });
    prisma.product.findMany.mockResolvedValue(created);
    const result = await service.seed({ count: 2, withStock: true });
    // service.seed should create exactly 2 products
    expect(created.length).toBe(2);
    expect(result).toEqual(created);
    expect(prisma.product.create).toHaveBeenCalledTimes(2);
  });
});
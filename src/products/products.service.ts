import { Injectable } from '@nestjs/common';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { SeedProductsUseCase } from '../application/use-cases/seed-products.use-case';
import { SeedProductsDto } from './dto/seed-products.dto';

/**
 * ProductsService encapsulates all logic for interacting with the
 * Product model.  It exposes methods to seed products for testing
 * and to list all available products.  In a real system you would
 * likely add more operations here such as creating, updating and
 * deleting products, but those are outside the scope of this test.
 */
@Injectable()
export class ProductsService {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly seedProductsUseCase: SeedProductsUseCase,
  ) {}

  /**
   * Returns all products currently stored in the database.  Each
   * product includes its id, name, price and stock quantity.
   */
  async findAll() {
    return this.listProductsUseCase.execute();
  }

  /**
   * Seed the database with a number of products.  Prices and stock
   * values are generated randomly within sensible ranges.  If
   * withStock is false then each product's stock is set to zero.
   *
   * @param dto instructions on how many products to create and
   *            whether to include stock.
   */
  async seed(dto: SeedProductsDto) {
    return this.seedProductsUseCase.execute(dto.count, dto.withStock);
  }
}
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SeedProductsDto } from './dto/seed-products.dto';

/**
 * ProductsController exposes HTTP routes for interacting with the
 * products resource.  All routes are prefixed with `/products` via
 * the controller decorator.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Retrieve all products currently available.  Returns an array of
   * Product entities with id, name, priceInCents and stock.
   */
  @Get()
  async getProducts() {
    return this.productsService.findAll();
  }

  /**
   * Seed the products table with a specified number of products.  This
   * endpoint is optional and intended for populating the database
   * during development or testing.  It returns the full list of
   * products after seeding.
   */
  @Post('seed')
  async seedProducts(@Body() dto: SeedProductsDto) {
    return this.productsService.seed(dto);
  }
}
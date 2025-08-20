import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

/**
 * Use case for populating the product catalogue with randomly
 * generated entries.  This is primarily used for demonstration
 * purposes.  The logic is delegated to the repository so that
 * the application layer remains independent of persistence
 * concerns.
 */
@Injectable()
export class SeedProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(count?: number, withStock?: boolean): Promise<Product[]> {
    return this.productRepo.seed(count, withStock);
  }
}
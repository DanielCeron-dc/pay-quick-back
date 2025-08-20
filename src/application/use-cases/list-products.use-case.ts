import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

/**
 * Use case for retrieving all products from the catalogue.  It
 * delegates to the injected ProductRepository so that business
 * logic remains decoupled from the data access layer.
 */
@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepo.findAll();
  }
}
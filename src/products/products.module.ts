import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { SeedProductsUseCase } from '../application/use-cases/seed-products.use-case';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma-product.repository';
import { ProductRepository } from '../domain/repositories/product.repository';

/**
 * ProductsModule bundles the service and controller for the products
 * domain.  It imports PrismaModule to gain access to the
 * PrismaService.  This module exposes endpoints for listing
 * products and seeding test data.
 */
@Module({
  imports: [PrismaModule],
  providers: [
    ProductsService,
    ListProductsUseCase,
    SeedProductsUseCase,
    // Bind the ProductRepository abstract class to its Prisma implementation.
    { provide: ProductRepository, useClass: PrismaProductRepository },
  ],
  controllers: [ProductsController],
  // Export the ProductRepository so it can be injected into other modules (e.g. TransactionsModule)
  exports: [ProductRepository],
})
export class ProductsModule {}
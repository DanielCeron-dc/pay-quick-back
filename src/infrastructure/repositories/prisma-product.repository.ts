import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

/**
 * Concrete implementation of the ProductRepository using Prisma.
 * This adapter translates domain requests into Prisma queries and
 * vice versa.  It lives in the infrastructure layer and is bound
 * via dependency injection to the domain interface in the module
 * configuration.
 */
@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => new Product(p.id, p.name, p.priceInCents, p.stock));
  }

  async findManyByIds(ids: number[]): Promise<Product[]> {
    const products = await this.prisma.product.findMany({ where: { id: { in: ids } } });
    return products.map((p) => new Product(p.id, p.name, p.priceInCents, p.stock));
  }

  async findById(id: number): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { id } });
    return p ? new Product(p.id, p.name, p.priceInCents, p.stock) : null;
  }

  async updateStock(productId: number, newStock: number): Promise<void> {
    await this.prisma.product.update({ where: { id: productId }, data: { stock: newStock } });
  }

  async seed(count = 3, withStock = true): Promise<Product[]> {
    const creations = [];
    for (let i = 0; i < count; i++) {
      const price = Math.floor(10000 + Math.random() * 90000);
      const stock = withStock ? Math.floor(Math.random() * 10) + 1 : 0;
      creations.push(
        this.prisma.product.create({
          data: {
            name: `Product ${i + 1}`,
            priceInCents: price,
            stock,
          },
        }),
      );
    }
    await Promise.all(creations);
    return this.findAll();
  }
}
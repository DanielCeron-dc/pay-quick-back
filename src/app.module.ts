import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HealthController } from './health/health.controller';

/**
 * The root module for the payments test backend.  It wires together
 * the Prisma module, domain modules and a simple health controller.
 * ConfigModule is loaded to read environment variables for Wompi keys.
 */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ProductsModule, TransactionsModule],
  controllers: [HealthController],
})
export class AppModule {}
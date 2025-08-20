import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ProductsModule } from '../products/products.module';
import { PrismaTransactionRepository } from '../infrastructure/repositories/prisma-transaction.repository';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { PayTransactionUseCase } from '../application/use-cases/pay-transaction.use-case';
import { GetTransactionUseCase } from '../application/use-cases/get-transaction.use-case';
import { WompiService } from '../infrastructure/services/wompi.service';

/**
 * TransactionsModule bundles the service and controller for the
 * transactions domain.  It depends on PrismaModule to access the
 * database.  This module exposes endpoints for creating,
 * processing and retrieving transactions.
 */
@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: process.env.WOMPI_UAT_SANDBOX_URL || 'https://api-sandbox.co.uat.wompi.dev/v1',
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [
    TransactionsService,
    CreateTransactionUseCase,
    PayTransactionUseCase,
    GetTransactionUseCase,
    WompiService,
    // Bind the TransactionRepository abstract class to its Prisma implementation.
    { provide: TransactionRepository, useClass: PrismaTransactionRepository },
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
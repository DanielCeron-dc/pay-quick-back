import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PayTransactionDto } from './dto/pay-transaction.dto';
import { TransactionStatus as DomainTransactionStatus } from '../domain/entities/transaction.entity';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { PayTransactionUseCase } from '../application/use-cases/pay-transaction.use-case';
import { GetTransactionUseCase } from '../application/use-cases/get-transaction.use-case';

/**
 * Facade service that delegates transaction operations to
 * individual use cases.  This class exposes the same API as the
 * original service but contains no business logic; instead it
 * orchestrates use case execution.  It also re-exports a local
 * TransactionStatusEnum to preserve backwards compatibility with
 * existing tests.
 */
@Injectable()
export class TransactionsService {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly payTransactionUseCase: PayTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  /**
   * Creates a new transaction and returns its identifier, amount and currency.
   */
  async createTransaction(dto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(dto);
  }

  /**
   * Processes payment for a pending transaction and returns the
   * updated status and Wompi response.
   */
  async payTransaction(id: number, dto: PayTransactionDto) {
    return this.payTransactionUseCase.execute(id, dto);
  }

  /**
   * Retrieves a transaction by id.  Throws if not found.
   */
  async getTransaction(id: number) {
    return this.getTransactionUseCase.execute(id);
  }

  /**
   * Local constant preserving the original TransactionStatusEnum for
   * backwards compatibility.  Tests import this constant from the
   * service.  It maps directly to the domain TransactionStatus enum.
   */
  static readonly TransactionStatusEnum = {
    PENDING: DomainTransactionStatus.PENDING,
    APPROVED: DomainTransactionStatus.APPROVED,
    DECLINED: DomainTransactionStatus.DECLINED,
  } as const;
}

export const TransactionStatusEnum = TransactionsService.TransactionStatusEnum;
export type TransactionStatus = DomainTransactionStatus;
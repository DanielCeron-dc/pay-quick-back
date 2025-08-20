import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

/**
 * Use case for retrieving a transaction by its identifier.  It
 * fetches the transaction via the repository and throws if it
 * cannot be found.
 */
@Injectable()
export class GetTransactionUseCase {
  constructor(private readonly txRepo: TransactionRepository) {}

  async execute(id: number): Promise<Transaction> {
    const tx = await this.txRepo.findById(id);
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }
}
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto, TransactionItemDto } from '../../transactions/dto/create-transaction.dto';

/**
 * Use case for creating a new transaction.  It verifies that
 * requested products exist, that sufficient stock is available and
 * computes the total amount.  The transaction is then persisted
 * via the TransactionRepository.
 */
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly txRepo: TransactionRepository,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<{ transactionId: number; amountInCents: number; currency: string }> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }
    // Fetch products and verify existence
    const productIds = dto.items.map((it) => it.productId);
    const products = await this.productRepo.findManyByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }
    // Compute total and check stock
    let total = 0;
    dto.items.forEach((item: TransactionItemDto) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.id}`);
      }
      total += product.priceInCents * item.quantity;
    });
    const currency = dto.currency ?? 'COP';
    const customerEmail = dto.customer?.email;
    if (!customerEmail) {
      throw new BadRequestException('Customer email is required');
    }
    const transaction = await this.txRepo.createTransaction(total, currency, customerEmail, dto.items);
    return { transactionId: transaction.id, amountInCents: total, currency };
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction, TransactionStatus, TransactionItem } from '../../domain/entities/transaction.entity';

/**
 * Concrete implementation of the TransactionRepository using Prisma.
 * This adapter translates domain requests into Prisma queries and
 * returns plain domain entities.  Complex operations (such as
 * creating transactions with nested items) are performed within
 * database transactions to ensure atomicity.
 */
@Injectable()
export class PrismaTransactionRepository extends TransactionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createTransaction(
    amountInCents: number,
    currency: string,
    customerEmail: string,
    items: { productId: number; quantity: number }[],
  ): Promise<Transaction> {
    const created = await this.prisma.executeTransaction(async (tx) => {
      return tx.transaction.create({
        data: {
          status: TransactionStatus.PENDING,
          amountInCents,
          currency,
          customerEmail,
          items: {
            create: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          },
        },
        include: { items: true },
      });
    });
    // map to domain Transaction
    const domainItems = created.items.map((it: any) => new TransactionItem(it.id, it.productId, it.quantity));
    return new Transaction(created.id, created.amountInCents, created.currency, created.status as TransactionStatus, created.customerEmail, domainItems);
  }

  async findById(id: number): Promise<Transaction | null> {
    const found = await this.prisma.transaction.findUnique({ where: { id }, include: { items: true } });
    if (!found) return null;
    const domainItems = found.items.map((it: any) => new TransactionItem(it.id, it.productId, it.quantity));
    return new Transaction(found.id, found.amountInCents, found.currency, found.status as TransactionStatus, found.customerEmail, domainItems);
  }

  async updateStatus(id: number, status: TransactionStatus): Promise<Transaction> {
    const updated = await this.prisma.transaction.update({ where: { id }, data: { status }, include: { items: true } });
    const domainItems = updated.items.map((it: any) => new TransactionItem(it.id, it.productId, it.quantity));
    return new Transaction(updated.id, updated.amountInCents, updated.currency, updated.status as TransactionStatus, updated.customerEmail, domainItems);
  }
}
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { WompiService } from '../../infrastructure/services/wompi.service';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { PayTransactionDto } from '../../transactions/dto/pay-transaction.dto';

/**
 * Use case for processing payment on a pending transaction.  It
 * retrieves the transaction, ensures it is pending, calls out to
 * Wompi to process payment and then updates the local transaction
 * and stock levels based on the outcome.
 */
@Injectable()
export class PayTransactionUseCase {
  constructor(
    private readonly txRepo: TransactionRepository,
    private readonly productRepo: ProductRepository,
    private readonly wompiService: WompiService,
  ) {}

  async execute(id: number, dto: PayTransactionDto): Promise<{ transactionId: number; status: TransactionStatus; wompi: any }> {
    const transaction = await this.txRepo.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction cannot be paid because it is not pending');
    }
    // call Wompi to process payment
    const { status: wompiStatus, wompi } = await this.wompiService.processPayment(transaction, dto.paymentMethod);
    // update local transaction status
    const updated = await this.txRepo.updateStatus(id, wompiStatus);
    // if approved, decrement stock for each item
    if (wompiStatus === TransactionStatus.APPROVED) {
      for (const item of transaction.items) {
        const product = await this.productRepo.findById(item.productId);
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for product ${product.id}`);
        }
        const newStock = product.stock - item.quantity;
        await this.productRepo.updateStock(product.id, newStock);
      }
    }
    return { transactionId: updated.id, status: updated.status, wompi };
  }
}
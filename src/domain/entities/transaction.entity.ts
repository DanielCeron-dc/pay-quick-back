import { Product } from './product.entity';

/**
 * Enum representing the lifecycle states of a transaction.  The
 * values are mirrored from the Wompi API but exist independently
 * from any persistence mechanism so that the domain layer remains
 * pure.
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

/**
 * Domain entity representing a single item purchased as part of a
 * transaction.  It associates a product with a quantity.  The id
 * field corresponds to the database primary key for the item.
 */
export class TransactionItem {
  constructor(
    public id: number,
    public productId: number,
    public quantity: number,
  ) {}
}

/**
 * Domain entity representing a payment transaction.  A transaction
 * records the total amount, currency, status, customer email and
 * the items purchased.  Business logic operates on these plain
 * objects rather than any ORM models.
 */
export class Transaction {
  constructor(
    public id: number,
    public amountInCents: number,
    public currency: string,
    public status: TransactionStatus,
    public customerEmail: string,
    public items: TransactionItem[],
  ) {}
}
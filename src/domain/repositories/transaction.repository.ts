import { Transaction, TransactionStatus, TransactionItem } from '../entities/transaction.entity';

/**
 * Port (interface) describing the operations required to persist
 * transactions.  Implementations in the infrastructure layer
 * provide concrete behaviour using a database.  Business logic
 * depends only on this interface.
 */
export abstract class TransactionRepository {
  /**
   * Creates a new transaction with the specified details and
   * returns the persisted Transaction including generated ids.
   *
   * @param amountInCents the total amount in COP cents
   * @param currency the currency code (e.g. 'COP')
   * @param customerEmail the customer's email
   * @param items the products and quantities being purchased
   */
  abstract createTransaction(
    amountInCents: number,
    currency: string,
    customerEmail: string,
    items: { productId: number; quantity: number }[],
  ): Promise<Transaction>;

  /**
   * Retrieves a transaction by id, including its items.  Returns null
   * if the transaction does not exist.
   */
  abstract findById(id: number): Promise<Transaction | null>;

  /**
   * Updates the status of a transaction and returns the updated
   * Transaction.  The items are included to support subsequent
   * operations such as stock updates.
   */
  abstract updateStatus(id: number, status: TransactionStatus): Promise<Transaction>;
}
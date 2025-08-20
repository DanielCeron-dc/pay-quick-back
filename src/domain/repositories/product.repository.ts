import { Product } from '../entities/product.entity';

/**
 * Port (interface) describing the operations required to access
 * product data.  Implementations in the infrastructure layer
 * provide concrete behaviour using a database or other storage
 * mechanism.  The domain and application layers depend only on
 * this interface, enabling substitution of data sources without
 * affecting business logic.
 */
export abstract class ProductRepository {
  /**
   * Returns all products in the catalogue.
   */
  abstract findAll(): Promise<Product[]>;

  /**
   * Returns the products with the given identifiers.  If any id
   * does not exist the resulting array will contain fewer
   * products than requested.
   */
  abstract findManyByIds(ids: number[]): Promise<Product[]>;

  /**
   * Returns a single product by id, or null if not found.
   */
  abstract findById(id: number): Promise<Product | null>;

  /**
   * Persists a change to a product's stock level.  The new stock
   * value is returned or void to indicate success.
   */
  abstract updateStock(productId: number, newStock: number): Promise<void>;

  /**
   * Seeds the catalogue with a set of randomly generated
   * products.  This operation is primarily used for testing and
   * demonstration purposes and should not be used in production.
   *
   * @param count the number of products to generate (default 3)
   * @param withStock whether to assign random stock quantities (default true)
   */
  abstract seed(count?: number, withStock?: boolean): Promise<Product[]>;
}
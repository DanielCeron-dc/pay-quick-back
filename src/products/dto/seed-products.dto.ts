/**
 * Data transfer object for seeding products.  Allows a caller to
 * specify how many products to create and whether each product
 * should be given a positive stock value.  This endpoint is optional
 * and primarily intended for testing/demo purposes.
 */
import { IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class SeedProductsDto {
  /**
   * Number of products to create (optional).  Must be a positive
   * integer.  Defaults to 3 when omitted.
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number;

  /**
   * If true, each product will be seeded with a random stock value.
   * This property is optional and defaults to true when omitted.
   */
  @IsOptional()
  @IsBoolean()
  withStock?: boolean = true;
}
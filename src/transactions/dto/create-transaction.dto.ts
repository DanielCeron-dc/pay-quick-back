/**
 * Data transfer objects representing the shape of input expected by
 * the create transaction endpoint.
 */

import { IsInt, Min, IsEmail, IsArray, ArrayNotEmpty, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionItemDto {
  /** Identifier of the product being purchased */
  @IsInt()
  @Min(1)
  productId!: number;
  /** Number of units of the product */
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CustomerDto {
  /** Customer's email address */
  @IsEmail()
  email!: string;
}

export class CreateTransactionDto {
  /** Items to purchase.  Required and must be a non-empty array. */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items!: TransactionItemDto[];
  /** Customer information.  Required. */
  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto;
  /** Currency for the transaction.  Optional; defaults to COP. */
  @IsOptional()
  @IsString()
  currency?: string = 'COP';
}
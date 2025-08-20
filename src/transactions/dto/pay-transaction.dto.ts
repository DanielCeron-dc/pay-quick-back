/**
 * Data transfer object for initiating a payment on a transaction.
 * Only card payments are supported in this test, but the structure
 * mirrors the Wompi API to allow future expansion.
 */
import { IsString, IsOptional, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO describing the structure of a payment method.  Only card
 * payments are supported for this test, but the shape mirrors
 * Wompi's API and can be extended in the future.
 */
export class PaymentMethodDto {
  @IsString()
  type!: string;
  @IsString()
  token!: string;
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;
}

export class PayTransactionDto {
  /** Payment method details.  Required. */
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod!: PaymentMethodDto;
}
/**
 * Domain entity representing a product in the catalogue.  This
 * entity holds only data and no persistence logic.  Prices are
 * expressed in Colombian pesos (COP) cents.
 */
export class Product {
  constructor(
    public id: number,
    public name: string,
    public priceInCents: number,
    public stock: number,
  ) {}
}
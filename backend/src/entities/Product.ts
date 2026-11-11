import { BaseEntity } from './BaseEntity';
import { ValidationError } from '../errors/AppError';

export class Product extends BaseEntity {
  private readonly _name: string;
  private _price: number;
  private _quantity: number;
  private readonly _categoryId: number;
  private readonly _supplierId: number;
  private readonly _categoryName: string;
  private readonly _supplierName: string;

  constructor(
    id: number,
    name: string,
    price: number,
    quantity: number,
    categoryId: number,
    supplierId: number,
    categoryName: string,
    supplierName: string,
  ) {
    super(id);
    this._name = name;
    this._price = price;
    this._quantity = quantity;
    this._categoryId = categoryId;
    this._supplierId = supplierId;
    this._categoryName = categoryName;
    this._supplierName = supplierName;
  }

  get name(): string {
    return this._name;
  }

  // Setters existem só onde há regra de negócio (valores inválidos são recusados)
  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (Number.isNaN(value) || value < 0) {
      throw new ValidationError('O preço não pode ser negativo.');
    }
    this._price = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new ValidationError('A quantidade em estoque não pode ser negativa.');
    }
    this._quantity = value;
  }

  get categoryName(): string {
    return this._categoryName;
  }

  get supplierName(): string {
    return this._supplierName;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this._name,
      price: this._price,
      quantity: this._quantity,
      categoryId: this._categoryId,
      supplierId: this._supplierId,
      categoryName: this._categoryName,
      supplierName: this._supplierName,
    };
  }
}

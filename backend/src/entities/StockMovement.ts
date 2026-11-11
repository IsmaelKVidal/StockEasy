import { BaseEntity } from './BaseEntity';
import type { MovementType } from '../types';

export class StockMovement extends BaseEntity {
  private readonly _productId: number;
  private readonly _productName: string;
  private readonly _type: MovementType;
  private readonly _quantity: number;
  private readonly _note: string | null;
  private readonly _createdAt: Date;

  constructor(
    id: number,
    productId: number,
    productName: string,
    type: MovementType,
    quantity: number,
    note: string | null,
    createdAt: Date,
  ) {
    super(id);
    this._productId = productId;
    this._productName = productName;
    this._type = type;
    this._quantity = quantity;
    this._note = note;
    this._createdAt = createdAt;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      productId: this._productId,
      productName: this._productName,
      type: this._type,
      quantity: this._quantity,
      note: this._note,
      createdAt: this._createdAt,
    };
  }
}

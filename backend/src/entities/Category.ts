import { BaseEntity } from './BaseEntity';

export class Category extends BaseEntity {
  private readonly _name: string;
  private readonly _description: string | null;

  constructor(id: number, name: string, description: string | null) {
    super(id);
    this._name = name;
    this._description = description;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  toJSON(): Record<string, unknown> {
    return { id: this.id, name: this._name, description: this._description };
  }
}

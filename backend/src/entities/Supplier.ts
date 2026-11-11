import { BaseEntity } from './BaseEntity';

export class Supplier extends BaseEntity {
  private readonly _name: string;
  private readonly _email: string | null;
  private readonly _phone: string | null;

  constructor(id: number, name: string, email: string | null, phone: string | null) {
    super(id);
    this._name = name;
    this._email = email;
    this._phone = phone;
  }

  get name(): string {
    return this._name;
  }

  get email(): string | null {
    return this._email;
  }

  get phone(): string | null {
    return this._phone;
  }

  toJSON(): Record<string, unknown> {
    return { id: this.id, name: this._name, email: this._email, phone: this._phone };
  }
}

import { BaseEntity } from './BaseEntity';

export class User extends BaseEntity {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _passwordHash: string;
  private readonly _cpf: string;

  constructor(id: number, name: string, email: string, passwordHash: string, cpf: string) {
    super(id);
    this._name = name;
    this._email = email;
    this._passwordHash = passwordHash;
    this._cpf = cpf;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get cpf(): string {
    return this._cpf;
  }

  // Nunca expõe a senha
  toJSON(): Record<string, unknown> {
    return { id: this.id, name: this._name, email: this._email, cpf: this._cpf };
  }
}

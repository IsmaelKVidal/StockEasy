// Classe abstrata: toda entidade tem id protegido e sabe se converter para JSON (polimorfismo)
export abstract class BaseEntity {
  private readonly _id: number;

  protected constructor(id: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  abstract toJSON(): Record<string, unknown>;
}

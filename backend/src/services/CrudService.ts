import { BaseEntity } from '../entities/BaseEntity';
import { NotFoundError } from '../errors/AppError';
import type { Page, Repository } from '../types';

// Serviço genérico dos CRUDs. Cada filho só implementa a validação (aberto para extensão, fechado para alteração).
export abstract class CrudService<T extends BaseEntity, I> {
  constructor(
    protected readonly repository: Repository<T, I>,
    private readonly notFoundMessage: string,
  ) {}

  // Valida e devolve os dados já limpos (trim, tipos corretos)
  protected abstract validate(input: I): I;

  list(page: number, limit: number): Promise<Page<T>> {
    return this.repository.findPage(page, limit);
  }

  async getById(id: number): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError(this.notFoundMessage);
    return item;
  }

  async create(input: I): Promise<T> {
    return this.repository.create(this.validate(input));
  }

  async update(id: number, input: I): Promise<T> {
    const updated = await this.repository.update(id, this.validate(input));
    if (!updated) throw new NotFoundError(this.notFoundMessage);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundError(this.notFoundMessage);
  }
}

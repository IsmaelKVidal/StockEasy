import { Category } from '../entities/Category';
import type { CategoryInput, Repository } from '../types';
import { optionalText, requireText } from '../validators';
import { CrudService } from './CrudService';

export class CategoryService extends CrudService<Category, CategoryInput> {
  constructor(repository: Repository<Category, CategoryInput>) {
    super(repository, 'Categoria não encontrada.');
  }

  protected validate(input: CategoryInput): CategoryInput {
    return {
      name: requireText(input.name, 'Nome', 100),
      description: optionalText(input.description, 'Descrição', 255),
    };
  }
}

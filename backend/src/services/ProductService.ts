import { Product } from '../entities/Product';
import type { ProductInput, Repository } from '../types';
import { requireInt, requireMoney, requireText } from '../validators';
import { CrudService } from './CrudService';

export class ProductService extends CrudService<Product, ProductInput> {
  constructor(repository: Repository<Product, ProductInput>) {
    super(repository, 'Produto não encontrado.');
  }

  protected validate(input: ProductInput): ProductInput {
    return {
      name: requireText(input.name, 'Nome', 100),
      price: requireMoney(input.price, 'Preço'),
      quantity: requireInt(input.quantity, 'Quantidade', 0),
      categoryId: requireInt(input.categoryId, 'Categoria', 1),
      supplierId: requireInt(input.supplierId, 'Fornecedor', 1),
    };
  }
}

import { Supplier } from '../entities/Supplier';
import { ValidationError } from '../errors/AppError';
import type { Repository, SupplierInput } from '../types';
import { isValidEmail, optionalText, requireText } from '../validators';
import { CrudService } from './CrudService';

export class SupplierService extends CrudService<Supplier, SupplierInput> {
  constructor(repository: Repository<Supplier, SupplierInput>) {
    super(repository, 'Fornecedor não encontrado.');
  }

  protected validate(input: SupplierInput): SupplierInput {
    const email = optionalText(input.email, 'E-mail', 150);
    if (email !== null && !isValidEmail(email)) {
      throw new ValidationError('Informe um e-mail válido para o fornecedor.');
    }
    return {
      name: requireText(input.name, 'Nome', 100),
      email,
      phone: optionalText(input.phone, 'Telefone', 20),
    };
  }
}

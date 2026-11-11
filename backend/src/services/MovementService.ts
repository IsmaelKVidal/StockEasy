import { StockMovement } from '../entities/StockMovement';
import { ValidationError } from '../errors/AppError';
import type { MovementInput, Repository } from '../types';
import { optionalText, requireInt } from '../validators';
import { CrudService } from './CrudService';

export class MovementService extends CrudService<StockMovement, MovementInput> {
  constructor(repository: Repository<StockMovement, MovementInput>) {
    super(repository, 'Movimentação não encontrada.');
  }

  protected validate(input: MovementInput): MovementInput {
    if (input.type !== 'ENTRADA' && input.type !== 'SAIDA') {
      throw new ValidationError('O tipo da movimentação deve ser ENTRADA ou SAIDA.');
    }
    return {
      productId: requireInt(input.productId, 'Produto', 1),
      type: input.type,
      quantity: requireInt(input.quantity, 'Quantidade', 1),
      note: optionalText(input.note, 'Observação', 255),
    };
  }
}

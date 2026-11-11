import { ValidationError } from '../errors/AppError';

export function parseId(value: string | undefined): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('ID inválido.');
  }
  return id;
}

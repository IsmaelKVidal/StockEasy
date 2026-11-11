import { hash } from 'bcryptjs';
import { User } from '../entities/User';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import type { UserUpdateInput } from '../types';
import { getPasswordError, isValidCpf, onlyDigits, requireText } from '../validators';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async update(authUserId: number, targetId: number, input: UserUpdateInput): Promise<User> {
    // O usuário só pode editar o próprio cadastro
    if (authUserId !== targetId) {
      throw new ForbiddenError('Você só pode editar o seu próprio usuário.');
    }

    const user = await this.userRepository.findById(targetId);
    if (!user) throw new NotFoundError('Usuário não encontrado.');

    // O e-mail não pode ser alterado
    if (input.email !== undefined && String(input.email).trim().toLowerCase() !== user.email) {
      throw new ValidationError('O e-mail não pode ser alterado.');
    }

    const name = input.name !== undefined ? requireText(input.name, 'Nome', 100) : user.name;

    let cpf = user.cpf;
    if (input.cpf !== undefined) {
      cpf = onlyDigits(requireText(input.cpf, 'CPF', 20));
      if (!isValidCpf(cpf)) throw new ValidationError('CPF inválido.');
      const owner = await this.userRepository.findByCpf(cpf);
      if (owner && owner.id !== user.id) {
        throw new ConflictError('Já existe um usuário cadastrado com este CPF.');
      }
    }

    let passwordHash = user.passwordHash;
    if (input.password !== undefined && input.password !== '') {
      if (typeof input.password !== 'string') throw new ValidationError('Senha inválida.');
      const passwordError = getPasswordError(input.password);
      if (passwordError) throw new ValidationError(passwordError);
      passwordHash = await hash(input.password, 10);
    }

    const updated = await this.userRepository.update(user.id, { name, cpf, passwordHash });
    if (!updated) throw new NotFoundError('Usuário não encontrado.');
    return updated;
  }
}

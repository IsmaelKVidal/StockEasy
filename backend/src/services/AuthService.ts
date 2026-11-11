import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../entities/User';
import { ConflictError, UnauthorizedError, ValidationError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import type { LoginInput, RegisterInput } from '../types';
import { getPasswordError, isValidCpf, isValidEmail, onlyDigits, requireText } from '../validators';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput): Promise<User> {
    const name = requireText(input.name, 'Nome', 100);
    const email = requireText(input.email, 'E-mail', 150).toLowerCase();
    const cpf = onlyDigits(requireText(input.cpf, 'CPF', 20));

    if (!isValidEmail(email)) throw new ValidationError('Informe um e-mail válido.');
    if (!isValidCpf(cpf)) throw new ValidationError('CPF inválido.');

    if (typeof input.password !== 'string' || input.password === '') {
      throw new ValidationError('O campo "Senha" é obrigatório.');
    }
    const passwordError = getPasswordError(input.password);
    if (passwordError) throw new ValidationError(passwordError);

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError('Já existe um usuário cadastrado com este e-mail.');
    }
    if (await this.userRepository.findByCpf(cpf)) {
      throw new ConflictError('Já existe um usuário cadastrado com este CPF.');
    }

    const passwordHash = await hash(input.password, 10);
    return this.userRepository.create({ name, email, passwordHash, cpf });
  }

  async login(input: LoginInput): Promise<{ token: string; user: User }> {
    if (typeof input.email !== 'string' || typeof input.password !== 'string' || input.password === '') {
      throw new ValidationError('Informe e-mail e senha.');
    }
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) throw new ValidationError('Informe um e-mail válido.');

    // Só loga usuário que existe e com a senha correta (mesma mensagem nos dois casos)
    const user = await this.userRepository.findByEmail(email);
    const passwordOk = user ? await compare(input.password, user.passwordHash) : false;
    if (!user || !passwordOk) throw new UnauthorizedError('E-mail ou senha inválidos.');

    const token = sign({}, env.jwtSecret, { subject: String(user.id), expiresIn: env.jwtExpiresIn });
    return { token, user };
  }
}

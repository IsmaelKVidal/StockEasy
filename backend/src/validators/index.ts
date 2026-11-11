import { ValidationError } from '../errors/AppError';

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return calcDigit(9) === Number(cpf[9]) && calcDigit(10) === Number(cpf[10]);
}

const passwordRules = [
  { message: 'pelo menos 8 caracteres', test: (p: string): boolean => p.length >= 8 },
  { message: 'uma letra maiúscula', test: (p: string): boolean => /[A-Z]/.test(p) },
  { message: 'uma letra minúscula', test: (p: string): boolean => /[a-z]/.test(p) },
  { message: 'um número', test: (p: string): boolean => /\d/.test(p) },
];

// Retorna a mensagem de erro do nível de senha, ou null se a senha for forte o bastante
export function getPasswordError(password: string): string | null {
  const failed = passwordRules.find((rule) => !rule.test(password));
  return failed ? `A senha precisa ter ${failed.message}.` : null;
}

export function requireText(value: unknown, field: string, max: number): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`O campo "${field}" é obrigatório.`);
  }
  const text = value.trim();
  if (text.length > max) {
    throw new ValidationError(`O campo "${field}" deve ter no máximo ${max} caracteres.`);
  }
  return text;
}

export function optionalText(value: unknown, field: string, max: number): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return requireText(value, field, max);
}

export function requireInt(value: unknown, field: string, min: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min) {
    throw new ValidationError(`O campo "${field}" deve ser um número inteiro maior ou igual a ${min}.`);
  }
  return value;
}

export function requireMoney(value: unknown, field: string): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    throw new ValidationError(`O campo "${field}" deve ser um número maior ou igual a zero.`);
  }
  return value;
}

export function isValidEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, '');
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

export const passwordRules = [
  { label: 'pelo menos 8 caracteres', test: (p: string): boolean => p.length >= 8 },
  { label: 'uma letra maiúscula', test: (p: string): boolean => /[A-Z]/.test(p) },
  { label: 'uma letra minúscula', test: (p: string): boolean => /[a-z]/.test(p) },
  { label: 'um número', test: (p: string): boolean => /\d/.test(p) },
];

export function getPasswordError(password: string): string | null {
  const failed = passwordRules.find((rule) => !rule.test(password));
  return failed ? `A senha precisa ter ${failed.label}.` : null;
}

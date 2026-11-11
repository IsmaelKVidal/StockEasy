import { passwordRules } from '../utils/validators';

// Mostra, enquanto o usuário digita, quais regras de senha já foram cumpridas
export default function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="rules">
      {passwordRules.map((rule) => (
        <li key={rule.label} className={rule.test(password) ? 'ok' : 'fail'}>
          {rule.test(password) ? '✓' : '○'} {rule.label}
        </li>
      ))}
    </ul>
  );
}

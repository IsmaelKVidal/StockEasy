import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordRules from '../components/PasswordRules';
import { apiRequest } from '../services/api';
import { getErrorMessage } from '../utils/errors';
import { getPasswordError, isValidCpf, isValidEmail } from '../utils/validators';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validação direta (enquanto o usuário digita)
  const cpfError = cpf && !isValidCpf(cpf) ? 'CPF inválido.' : undefined;
  const emailError = email && !isValidEmail(email.trim()) ? 'E-mail inválido.' : undefined;
  const confirmError = confirm && confirm !== password ? 'As senhas não conferem.' : undefined;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !cpf.trim() || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    if (!isValidEmail(email.trim())) return setError('Informe um e-mail válido.');
    if (!isValidCpf(cpf)) return setError('CPF inválido.');
    const passwordError = getPasswordError(password);
    if (passwordError) return setError(passwordError);
    if (password !== confirm) return setError('As senhas não conferem.');

    setLoading(true);
    try {
      await apiRequest('/auth/register', 'POST', { name: name.trim(), email: email.trim(), cpf, password });
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça login.' } });
    } catch (e) {
      setError(getErrorMessage(e)); // mensagem vinda da API
      setLoading(false);
    }
  }

  return (
    <div className="card auth-box">
      <h2>Criar conta</h2>
      <Alert type="error" message={error} />
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="E-mail" type="email" value={email} error={emailError} onChange={(e) => setEmail(e.target.value)} />
        <Input label="CPF" value={cpf} error={cpfError} placeholder="000.000.000-00" onChange={(e) => setCpf(e.target.value)} />
        <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordRules password={password} />
        <Input
          label="Confirmar senha"
          type="password"
          value={confirm}
          error={confirmError}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}

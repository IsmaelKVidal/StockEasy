import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../utils/errors';
import { isValidEmail } from '../utils/validators';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)?.message ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!isValidEmail(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!password) {
      setError('Informe a senha.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/'); // área logada
    } catch (e) {
      setError(getErrorMessage(e));
      setLoading(false);
    }
  }

  return (
    <div className="card auth-box">
      <h1>StockEasy</h1>
      <h2>Entrar</h2>
      <Alert type="success" message={successMessage} />
      <Alert type="error" message={error} />
      <form onSubmit={handleSubmit} noValidate>
        <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p>
        Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordRules from '../components/PasswordRules';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import type { User } from '../types';
import { getErrorMessage } from '../utils/errors';
import { getPasswordError, isValidCpf } from '../utils/validators';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [cpf, setCpf] = useState(user?.cpf ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user) return;
    if (!name.trim()) return setError('O nome é obrigatório.');
    if (!isValidCpf(cpf)) return setError('CPF inválido.');
    if (password) {
      const passwordError = getPasswordError(password);
      if (passwordError) return setError(passwordError);
      if (password !== confirm) return setError('As senhas não conferem.');
    }

    // O e-mail nunca é enviado: ele não pode ser alterado
    const payload: { name: string; cpf: string; password?: string } = { name: name.trim(), cpf };
    if (password) payload.password = password;

    setSaving(true);
    try {
      const updated = await apiRequest<User>(`/users/${user.id}`, 'PUT', payload);
      updateUser(updated);
      setPassword('');
      setConfirm('');
      setSuccess('Dados atualizados com sucesso!');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Meu perfil</h2>
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />
      <form onSubmit={handleSubmit} noValidate>
        <Input label="E-mail (não pode ser alterado)" value={user?.email ?? ''} disabled readOnly />
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        <Input
          label="Nova senha (deixe em branco para manter)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && <PasswordRules password={password} />}
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </div>
  );
}

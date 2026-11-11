import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { SelectOption } from '../types';
import { getErrorMessage } from '../utils/errors';
import Alert from './Alert';
import Button from './Button';

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select';
  required?: boolean;
  options?: SelectOption[];
  step?: string;
  disabledOnEdit?: boolean;
}

type Values = Record<string, string>;

interface CrudFormProps<T> {
  title: string;
  endpoint: string;
  listPath: string;
  fields: FieldDef[];
  toValues: (item: T) => Values;
  toPayload: (values: Values) => unknown;
  validate?: (values: Values) => string | null;
}

// Tela de cadastro/edição genérica: a mesma tela serve para criar (sem id) e editar (com id na URL)
export default function CrudForm<T>({ title, endpoint, listPath, fields, toValues, toPayload, validate }: CrudFormProps<T>) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== undefined;

  const [values, setValues] = useState<Values>(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    apiRequest<T>(`${endpoint}/${id}`)
      .then((item) => setValues(toValues(item)))
      .catch((e: unknown) => setError(getErrorMessage(e)));
  }, [endpoint, id]);

  function handleChange(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    for (const field of fields) {
      if (field.required && !(values[field.name] ?? '').trim()) {
        setError(`O campo "${field.label}" é obrigatório.`);
        return;
      }
    }
    const validationError = validate ? validate(values) : null;
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      await apiRequest(isEdit ? `${endpoint}/${id}` : endpoint, isEdit ? 'PUT' : 'POST', toPayload(values));
      navigate(listPath);
    } catch (e) {
      setError(getErrorMessage(e));
      setSaving(false);
    }
  }

  function renderField(field: FieldDef) {
    const disabled = isEdit && field.disabledOnEdit === true;
    const value = values[field.name] ?? '';

    let control;
    if (field.type === 'textarea') {
      control = (
        <textarea id={field.name} value={value} rows={3} onChange={(e) => handleChange(field.name, e.target.value)} />
      );
    } else if (field.type === 'select') {
      control = (
        <select id={field.name} value={value} disabled={disabled} onChange={(e) => handleChange(field.name, e.target.value)}>
          <option value="">Selecione...</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      control = (
        <input
          id={field.name}
          type={field.type === 'number' ? 'number' : 'text'}
          step={field.step}
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      );
    }

    return (
      <div className="field" key={field.name}>
        <label htmlFor={field.name}>
          {field.label}
          {field.required ? ' *' : ''}
        </label>
        {control}
      </div>
    );
  }

  return (
    <div className="card">
      <h2>
        {isEdit ? 'Editar' : 'Cadastrar'} {title}
      </h2>
      <Alert type="error" message={error} />
      <form onSubmit={handleSubmit} noValidate>
        {fields.map(renderField)}
        <div className="form-actions">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(listPath)}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

import CrudForm, { type FieldDef } from '../../components/CrudForm';
import type { Category } from '../../types';

const fields: FieldDef[] = [
  { name: 'name', label: 'Nome', required: true },
  { name: 'description', label: 'Descrição', type: 'textarea' },
];

export default function CategoryFormPage() {
  return (
    <CrudForm<Category>
      title="categoria"
      endpoint="/categories"
      listPath="/categories"
      fields={fields}
      toValues={(c) => ({ name: c.name, description: c.description ?? '' })}
      toPayload={(v) => ({ name: v.name.trim(), description: v.description.trim() || null })}
    />
  );
}

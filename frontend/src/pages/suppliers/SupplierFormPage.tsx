import CrudForm, { type FieldDef } from '../../components/CrudForm';
import type { Supplier } from '../../types';
import { isValidEmail } from '../../utils/validators';

const fields: FieldDef[] = [
  { name: 'name', label: 'Nome', required: true },
  { name: 'email', label: 'E-mail' },
  { name: 'phone', label: 'Telefone' },
];

// Função exclusiva desta página
function validateSupplier(values: Record<string, string>): string | null {
  if (values.email.trim() && !isValidEmail(values.email.trim())) {
    return 'Informe um e-mail válido para o fornecedor.';
  }
  return null;
}

export default function SupplierFormPage() {
  return (
    <CrudForm<Supplier>
      title="fornecedor"
      endpoint="/suppliers"
      listPath="/suppliers"
      fields={fields}
      validate={validateSupplier}
      toValues={(s) => ({ name: s.name, email: s.email ?? '', phone: s.phone ?? '' })}
      toPayload={(v) => ({
        name: v.name.trim(),
        email: v.email.trim() || null,
        phone: v.phone.trim() || null,
      })}
    />
  );
}

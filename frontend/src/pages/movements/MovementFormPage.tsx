import CrudForm, { type FieldDef } from '../../components/CrudForm';
import { useOptions } from '../../hooks/useOptions';
import type { Movement } from '../../types';

// Função exclusiva desta página
function validateMovement(values: Record<string, string>): string | null {
  const quantity = Number(values.quantity);
  if (!Number.isInteger(quantity) || quantity <= 0) return 'A quantidade deve ser um número inteiro maior que zero.';
  return null;
}

export default function MovementFormPage() {
  const products = useOptions('/products');

  // Ao editar, só a observação pode mudar (o histórico de estoque não é reescrito)
  const fields: FieldDef[] = [
    { name: 'productId', label: 'Produto', type: 'select', options: products, required: true, disabledOnEdit: true },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'ENTRADA', label: 'Entrada' },
        { value: 'SAIDA', label: 'Saída' },
      ],
      required: true,
      disabledOnEdit: true,
    },
    { name: 'quantity', label: 'Quantidade', type: 'number', required: true, disabledOnEdit: true },
    { name: 'note', label: 'Observação', type: 'textarea' },
  ];

  return (
    <CrudForm<Movement>
      title="movimentação"
      endpoint="/movements"
      listPath="/movements"
      fields={fields}
      validate={validateMovement}
      toValues={(m) => ({
        productId: String(m.productId),
        type: m.type,
        quantity: String(m.quantity),
        note: m.note ?? '',
      })}
      toPayload={(v) => ({
        productId: Number(v.productId),
        type: v.type,
        quantity: Number(v.quantity),
        note: v.note.trim() || null,
      })}
    />
  );
}

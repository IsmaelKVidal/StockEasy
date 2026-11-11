import CrudForm, { type FieldDef } from '../../components/CrudForm';
import { useOptions } from '../../hooks/useOptions';
import type { Product } from '../../types';

// Função exclusiva desta página
function validateProduct(values: Record<string, string>): string | null {
  const price = Number(values.price);
  if (Number.isNaN(price) || price < 0) return 'O preço deve ser maior ou igual a zero.';
  const quantity = Number(values.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) return 'A quantidade deve ser um número inteiro maior ou igual a zero.';
  return null;
}

export default function ProductFormPage() {
  const categories = useOptions('/categories');
  const suppliers = useOptions('/suppliers');

  const fields: FieldDef[] = [
    { name: 'name', label: 'Nome', required: true },
    { name: 'price', label: 'Preço (R$)', type: 'number', step: '0.01', required: true },
    { name: 'quantity', label: 'Quantidade em estoque', type: 'number', required: true },
    { name: 'categoryId', label: 'Categoria', type: 'select', options: categories, required: true },
    { name: 'supplierId', label: 'Fornecedor', type: 'select', options: suppliers, required: true },
  ];

  return (
    <CrudForm<Product>
      title="produto"
      endpoint="/products"
      listPath="/products"
      fields={fields}
      validate={validateProduct}
      toValues={(p) => ({
        name: p.name,
        price: String(p.price),
        quantity: String(p.quantity),
        categoryId: String(p.categoryId),
        supplierId: String(p.supplierId),
      })}
      toPayload={(v) => ({
        name: v.name.trim(),
        price: Number(v.price),
        quantity: Number(v.quantity),
        categoryId: Number(v.categoryId),
        supplierId: Number(v.supplierId),
      })}
    />
  );
}

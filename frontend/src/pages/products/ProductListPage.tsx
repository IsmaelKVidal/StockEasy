import CrudList from '../../components/CrudList';
import type { Column } from '../../components/Table';
import type { Product } from '../../types';

// Componente exclusivo desta página
function PriceCell({ value }: { value: number }) {
  return <span>R$ {value.toFixed(2).replace('.', ',')}</span>;
}

const columns: Column<Product>[] = [
  { header: 'Nome', render: (p) => p.name },
  { header: 'Preço', render: (p) => <PriceCell value={p.price} /> },
  { header: 'Estoque', render: (p) => p.quantity },
  { header: 'Categoria', render: (p) => p.categoryName },
  { header: 'Fornecedor', render: (p) => p.supplierName },
];

export default function ProductListPage() {
  return <CrudList<Product> title="Produtos" endpoint="/products" basePath="/products" columns={columns} />;
}

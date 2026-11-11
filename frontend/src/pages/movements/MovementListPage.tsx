import CrudList from '../../components/CrudList';
import type { Column } from '../../components/Table';
import type { Movement } from '../../types';

// Componente exclusivo desta página
function TypeBadge({ type }: { type: Movement['type'] }) {
  return type === 'ENTRADA' ? (
    <span className="badge badge-in">Entrada</span>
  ) : (
    <span className="badge badge-out">Saída</span>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR');
}

const columns: Column<Movement>[] = [
  { header: 'Produto', render: (m) => m.productName },
  { header: 'Tipo', render: (m) => <TypeBadge type={m.type} /> },
  { header: 'Quantidade', render: (m) => m.quantity },
  { header: 'Observação', render: (m) => m.note ?? '-' },
  { header: 'Data', render: (m) => formatDate(m.createdAt) },
];

export default function MovementListPage() {
  return <CrudList<Movement> title="Movimentações de estoque" endpoint="/movements" basePath="/movements" columns={columns} />;
}

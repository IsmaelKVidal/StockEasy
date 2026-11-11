import CrudList from '../../components/CrudList';
import type { Column } from '../../components/Table';
import type { Supplier } from '../../types';

const columns: Column<Supplier>[] = [
  { header: 'Nome', render: (s) => s.name },
  { header: 'E-mail', render: (s) => s.email ?? '-' },
  { header: 'Telefone', render: (s) => s.phone ?? '-' },
];

export default function SupplierListPage() {
  return <CrudList<Supplier> title="Fornecedores" endpoint="/suppliers" basePath="/suppliers" columns={columns} />;
}

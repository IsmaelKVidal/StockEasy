import CrudList from '../../components/CrudList';
import type { Column } from '../../components/Table';
import type { Category } from '../../types';

const columns: Column<Category>[] = [
  { header: 'Nome', render: (c) => c.name },
  { header: 'Descrição', render: (c) => c.description ?? '-' },
];

export default function CategoryListPage() {
  return <CrudList<Category> title="Categorias" endpoint="/categories" basePath="/categories" columns={columns} />;
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { Page } from '../types';
import { getErrorMessage } from '../utils/errors';
import Alert from './Alert';
import Button from './Button';
import Pagination from './Pagination';
import Table, { type Column } from './Table';

interface CrudListProps<T extends { id: number }> {
  title: string;
  endpoint: string;
  basePath: string;
  columns: Column<T>[];
}

// Tela de listagem genérica: tabela + paginação + botões de editar e excluir
export default function CrudList<T extends { id: number }>({ title, endpoint, basePath, columns }: CrudListProps<T>) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Page<T> | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setError('');
    apiRequest<Page<T>>(`${endpoint}?page=${page}&limit=5`)
      .then(setResult)
      .catch((e: unknown) => setError(getErrorMessage(e)));
  }, [endpoint, page, reloadKey]);

  async function handleDelete(item: T) {
    if (!window.confirm('Deseja realmente excluir este registro?')) return;
    try {
      await apiRequest<void>(`${endpoint}/${item.id}`, 'DELETE');
      if (result && result.data.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  return (
    <div className="card">
      <div className="toolbar">
        <h2>{title}</h2>
        <Link className="btn" to={`${basePath}/new`}>
          + Novo
        </Link>
      </div>

      <Alert type="error" message={error} />

      <Table
        columns={columns}
        rows={result?.data ?? []}
        renderActions={(item) => (
          <>
            <Link className="btn btn-secondary btn-small" to={`${basePath}/${item.id}/edit`}>
              Editar
            </Link>
            <Button variant="danger" small onClick={() => handleDelete(item)}>
              Excluir
            </Button>
          </>
        )}
      />

      {result && <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />}
    </div>
  );
}

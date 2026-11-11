import Button from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="pagination">
      <Button variant="secondary" small disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </Button>
      <span>
        Página {page} de {totalPages}
      </span>
      <Button variant="secondary" small disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Próxima
      </Button>
    </div>
  );
}

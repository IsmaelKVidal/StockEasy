import type { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
}

interface TableProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  renderActions?: (item: T) => ReactNode;
}

export default function Table<T extends { id: number }>({ columns, rows, renderActions }: TableProps<T>) {
  const totalColumns = columns.length + (renderActions ? 1 : 0);

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
          {renderActions && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={totalColumns} className="empty">
              Nenhum registro encontrado.
            </td>
          </tr>
        )}
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.header}>{column.render(row)}</td>
            ))}
            {renderActions && <td className="actions">{renderActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

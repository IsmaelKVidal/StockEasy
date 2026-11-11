import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import type { Page, SelectOption } from '../types';

// Carrega uma lista (ex.: categorias) já no formato das opções de um <select>
export function useOptions(endpoint: string): SelectOption[] {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    apiRequest<Page<{ id: number; name: string }>>(`${endpoint}?page=1&limit=100`)
      .then((page) => setOptions(page.data.map((item) => ({ value: String(item.id), label: item.name }))))
      .catch(() => setOptions([]));
  }, [endpoint]);

  return options;
}

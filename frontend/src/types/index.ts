export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  supplierId: number;
  categoryName: string;
  supplierName: string;
}

export interface Movement {
  id: number;
  productId: number;
  productName: string;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  note: string | null;
  createdAt: string;
}

export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

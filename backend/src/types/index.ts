export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Contrato comum de todos os repositórios (usado pelos serviços)
export interface Repository<T, I> {
  findPage(page: number, limit: number): Promise<Page<T>>;
  findById(id: number): Promise<T | null>;
  create(input: I): Promise<T>;
  update(id: number, input: I): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export interface CategoryInput {
  name: string;
  description?: string | null;
}

export interface SupplierInput {
  name: string;
  email?: string | null;
  phone?: string | null;
}

export interface ProductInput {
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  supplierId: number;
}

export type MovementType = 'ENTRADA' | 'SAIDA';

export interface MovementInput {
  productId: number;
  type: MovementType;
  quantity: number;
  note?: string | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserUpdateInput {
  name?: string;
  cpf?: string;
  password?: string;
  email?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  model: string;
  maxTokens: number;
  useStockData: boolean;
  systemPrompt: string;
}

export interface Guardrails {
  maxMessageLength: number;
  maxResponseChars: number;
  blockedTerms: string[];
  rules: string[];
}

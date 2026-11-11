import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { Product } from '../entities/Product';
import type { ProductInput } from '../types';
import { BaseRepository } from './BaseRepository';

export class ProductRepository extends BaseRepository<Product, ProductInput> {
  protected readonly table = 'products';

  // Relacionamento: produto pertence a uma categoria e a um fornecedor
  protected get baseSelect(): string {
    return `SELECT t.*, c.name AS category_name, s.name AS supplier_name
            FROM products t
            JOIN categories c ON c.id = t.category_id
            JOIN suppliers s ON s.id = t.supplier_id`;
  }

  protected toEntity(row: RowDataPacket): Product {
    return new Product(
      row.id,
      row.name,
      Number(row.price),
      row.quantity,
      row.category_id,
      row.supplier_id,
      row.category_name,
      row.supplier_name,
    );
  }

  async create(input: ProductInput): Promise<Product> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO products (name, price, quantity, category_id, supplier_id) VALUES (?, ?, ?, ?, ?)',
      [input.name, input.price, input.quantity, input.categoryId, input.supplierId],
    );
    return this.reload(result.insertId);
  }

  async update(id: number, input: ProductInput): Promise<Product | null> {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, quantity = ?, category_id = ?, supplier_id = ? WHERE id = ?',
      [input.name, input.price, input.quantity, input.categoryId, input.supplierId, id],
    );
    return this.findById(id);
  }
}

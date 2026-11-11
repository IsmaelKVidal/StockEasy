import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { Category } from '../entities/Category';
import type { CategoryInput } from '../types';
import { BaseRepository } from './BaseRepository';

export class CategoryRepository extends BaseRepository<Category, CategoryInput> {
  protected readonly table = 'categories';

  protected toEntity(row: RowDataPacket): Category {
    return new Category(row.id, row.name, row.description);
  }

  async create(input: CategoryInput): Promise<Category> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [input.name, input.description ?? null],
    );
    return this.reload(result.insertId);
  }

  async update(id: number, input: CategoryInput): Promise<Category | null> {
    await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [
      input.name,
      input.description ?? null,
      id,
    ]);
    return this.findById(id);
  }
}

import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { BaseEntity } from '../entities/BaseEntity';
import { NotFoundError } from '../errors/AppError';
import type { Page, Repository } from '../types';

// Repositório genérico: T = entidade, I = dados de entrada. Cada filho só define o que é específico.
export abstract class BaseRepository<T extends BaseEntity, I> implements Repository<T, I> {
  protected abstract readonly table: string;

  protected abstract toEntity(row: RowDataPacket): T;
  abstract create(input: I): Promise<T>;
  abstract update(id: number, input: I): Promise<T | null>;

  // Os filhos podem sobrescrever para fazer JOIN (alias da tabela principal: t)
  protected get baseSelect(): string {
    return `SELECT t.* FROM ${this.table} t`;
  }

  async findPage(page: number, limit: number): Promise<Page<T>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      `${this.baseSelect} ORDER BY t.id DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    const [counts] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${this.table}`);
    const total = Number(counts[0].total);

    return {
      data: rows.map((row) => this.toEntity(row)),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: number): Promise<T | null> {
    const [rows] = await pool.query<RowDataPacket[]>(`${this.baseSelect} WHERE t.id = ?`, [id]);
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  protected async reload(id: number): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) throw new NotFoundError();
    return entity;
  }
}

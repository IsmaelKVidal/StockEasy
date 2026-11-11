import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { Supplier } from '../entities/Supplier';
import type { SupplierInput } from '../types';
import { BaseRepository } from './BaseRepository';

export class SupplierRepository extends BaseRepository<Supplier, SupplierInput> {
  protected readonly table = 'suppliers';

  protected toEntity(row: RowDataPacket): Supplier {
    return new Supplier(row.id, row.name, row.email, row.phone);
  }

  async create(input: SupplierInput): Promise<Supplier> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO suppliers (name, email, phone) VALUES (?, ?, ?)',
      [input.name, input.email ?? null, input.phone ?? null],
    );
    return this.reload(result.insertId);
  }

  async update(id: number, input: SupplierInput): Promise<Supplier | null> {
    await pool.query('UPDATE suppliers SET name = ?, email = ?, phone = ? WHERE id = ?', [
      input.name,
      input.email ?? null,
      input.phone ?? null,
      id,
    ]);
    return this.findById(id);
  }
}

import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { StockMovement } from '../entities/StockMovement';
import { NotFoundError, ValidationError } from '../errors/AppError';
import type { MovementInput } from '../types';
import { BaseRepository } from './BaseRepository';

export class MovementRepository extends BaseRepository<StockMovement, MovementInput> {
  protected readonly table = 'stock_movements';

  // Relacionamento: movimentação pertence a um produto
  protected get baseSelect(): string {
    return `SELECT t.*, p.name AS product_name
            FROM stock_movements t
            JOIN products p ON p.id = t.product_id`;
  }

  protected toEntity(row: RowDataPacket): StockMovement {
    return new StockMovement(
      row.id,
      row.product_id,
      row.product_name,
      row.type,
      row.quantity,
      row.note,
      row.created_at,
    );
  }

  // Ao registrar a movimentação, o estoque do produto é atualizado (tudo em uma transação)
  async create(input: MovementInput): Promise<StockMovement> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT quantity FROM products WHERE id = ? FOR UPDATE',
        [input.productId],
      );
      if (rows.length === 0) throw new NotFoundError('Produto não encontrado.');

      const current = Number(rows[0].quantity);
      const updated = input.type === 'ENTRADA' ? current + input.quantity : current - input.quantity;
      if (updated < 0) {
        throw new ValidationError(`Estoque insuficiente. Quantidade atual: ${current}.`);
      }

      await connection.query('UPDATE products SET quantity = ? WHERE id = ?', [updated, input.productId]);
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO stock_movements (product_id, type, quantity, note) VALUES (?, ?, ?, ?)',
        [input.productId, input.type, input.quantity, input.note ?? null],
      );

      await connection.commit();
      return this.reload(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Movimentação já registrada é histórico: só a observação pode ser alterada
  async update(id: number, input: MovementInput): Promise<StockMovement | null> {
    await pool.query('UPDATE stock_movements SET note = ? WHERE id = ?', [input.note ?? null, id]);
    return this.findById(id);
  }
}

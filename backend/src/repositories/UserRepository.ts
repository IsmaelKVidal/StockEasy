import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { User } from '../entities/User';

export interface NewUserData {
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
}

export interface UserChanges {
  name: string;
  cpf: string;
  passwordHash: string;
}

export class UserRepository {
  private toEntity(row: RowDataPacket): User {
    return new User(row.id, row.name, row.email, row.password, row.cpf);
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async create(data: NewUserData): Promise<User> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)',
      [data.name, data.email, data.passwordHash, data.cpf],
    );
    return new User(result.insertId, data.name, data.email, data.passwordHash, data.cpf);
  }

  async update(id: number, changes: UserChanges): Promise<User | null> {
    await pool.query('UPDATE users SET name = ?, cpf = ?, password = ? WHERE id = ?', [
      changes.name,
      changes.cpf,
      changes.passwordHash,
      id,
    ]);
    return this.findById(id);
  }
}

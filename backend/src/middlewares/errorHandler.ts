import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

function getDbCode(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    return String((err as { code: unknown }).code);
  }
  return '';
}

// Transforma qualquer erro em uma resposta JSON com mensagem amigável
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  if (err instanceof SyntaxError) {
    res.status(400).json({ message: 'O corpo da requisição não é um JSON válido.' });
    return;
  }

  const code = getDbCode(err);
  if (code === 'ER_ROW_IS_REFERENCED_2') {
    res.status(409).json({ message: 'Não é possível excluir: existem registros vinculados a este item.' });
    return;
  }
  if (code === 'ER_NO_REFERENCED_ROW_2') {
    res.status(400).json({ message: 'A categoria, o fornecedor ou o produto informado não existe.' });
    return;
  }
  if (code === 'ER_DUP_ENTRY') {
    res.status(409).json({ message: 'Já existe um registro com estes dados.' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor. Tente novamente mais tarde.' });
}

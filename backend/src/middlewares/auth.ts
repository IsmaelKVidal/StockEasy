import type { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../errors/AppError';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new UnauthorizedError('Token não informado. Faça login.'));
    return;
  }

  try {
    const payload = verify(header.slice(7), env.jwtSecret) as JwtPayload;
    req.userId = Number(payload.sub);
    next();
  } catch {
    next(new UnauthorizedError('Sessão inválida ou expirada. Faça login novamente.'));
  }
}

export function getAuthUserId(req: Request): number {
  if (req.userId === undefined) throw new UnauthorizedError();
  return req.userId;
}

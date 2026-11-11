import type { Request, RequestHandler, Response } from 'express';

// Encaminha erros de funções async para o errorHandler
export function asyncHandler(fn: (req: Request, res: Response) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
}

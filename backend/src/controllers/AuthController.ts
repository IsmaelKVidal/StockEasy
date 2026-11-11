import { asyncHandler } from '../middlewares/asyncHandler';
import { AuthService } from '../services/AuthService';
import type { LoginInput, RegisterInput } from '../types';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = asyncHandler(async (req, res) => {
    const user = await this.service.register(req.body as RegisterInput);
    res.status(201).json({ message: 'Cadastro realizado com sucesso.', user });
  });

  login = asyncHandler(async (req, res) => {
    const result = await this.service.login(req.body as LoginInput);
    res.json(result);
  });
}

import { getAuthUserId } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/asyncHandler';
import { UserService } from '../services/UserService';
import type { UserUpdateInput } from '../types';
import { parseId } from '../utils/params';

export class UserController {
  constructor(private readonly service: UserService) {}

  update = asyncHandler(async (req, res) => {
    const user = await this.service.update(
      getAuthUserId(req),
      parseId(req.params.id),
      req.body as UserUpdateInput,
    );
    res.json(user);
  });
}

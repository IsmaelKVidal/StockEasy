import { asyncHandler } from '../middlewares/asyncHandler';
import { AgentService } from '../services/AgentService';

export class AgentController {
  constructor(private readonly service: AgentService) {}

  list = asyncHandler(async (_req, res) => {
    res.json(this.service.listProfiles());
  });

  chat = asyncHandler(async (req, res) => {
    const body = req.body as { agent?: unknown; message?: unknown };
    res.json(await this.service.chat(body.agent, body.message));
  });
}

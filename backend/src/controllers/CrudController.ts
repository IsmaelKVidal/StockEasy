import { BaseEntity } from '../entities/BaseEntity';
import { asyncHandler } from '../middlewares/asyncHandler';
import { CrudService } from '../services/CrudService';
import { parseId } from '../utils/params';

// Controller genérico: lista com paginação, busca por id, cria, edita e exclui
export class CrudController<T extends BaseEntity, I> {
  constructor(private readonly service: CrudService<T, I>) {}

  list = asyncHandler(async (req, res) => {
    const page = Math.max(1, Math.floor(Number(req.query.page)) || 1);
    const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit)) || 10));
    res.json(await this.service.list(page, limit));
  });

  get = asyncHandler(async (req, res) => {
    res.json(await this.service.getById(parseId(req.params.id)));
  });

  create = asyncHandler(async (req, res) => {
    res.status(201).json(await this.service.create(req.body as I));
  });

  update = asyncHandler(async (req, res) => {
    res.json(await this.service.update(parseId(req.params.id), req.body as I));
  });

  remove = asyncHandler(async (req, res) => {
    await this.service.remove(parseId(req.params.id));
    res.status(204).send();
  });
}

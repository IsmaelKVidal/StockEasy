import { Router } from 'express';
import { BaseEntity } from '../entities/BaseEntity';
import { CrudController } from '../controllers/CrudController';

export function crudRouter<T extends BaseEntity, I>(controller: CrudController<T, I>): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

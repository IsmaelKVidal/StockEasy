import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { AuthController } from '../controllers/AuthController';
import { CrudController } from '../controllers/CrudController';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { MovementRepository } from '../repositories/MovementRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { SupplierRepository } from '../repositories/SupplierRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AgentService } from '../services/AgentService';
import { AuthService } from '../services/AuthService';
import { CategoryService } from '../services/CategoryService';
import { MovementService } from '../services/MovementService';
import { ProductService } from '../services/ProductService';
import { SupplierService } from '../services/SupplierService';
import { UserService } from '../services/UserService';
import { crudRouter } from './crudRoutes';

// Aqui as peças são montadas (repositório -> serviço -> controller -> rota)
const userRepository = new UserRepository();
const productRepository = new ProductRepository();

const authController = new AuthController(new AuthService(userRepository));
const userController = new UserController(new UserService(userRepository));
const agentController = new AgentController(new AgentService(productRepository));

const router = Router();

// Rotas públicas
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Tudo abaixo exige token JWT
router.use(authMiddleware);

router.put('/users/:id', userController.update);

router.use('/categories', crudRouter(new CrudController(new CategoryService(new CategoryRepository()))));
router.use('/suppliers', crudRouter(new CrudController(new SupplierService(new SupplierRepository()))));
router.use('/products', crudRouter(new CrudController(new ProductService(productRepository))));
router.use('/movements', crudRouter(new CrudController(new MovementService(new MovementRepository()))));

router.get('/agents', agentController.list);
router.post('/agents/chat', agentController.chat);

export default router;

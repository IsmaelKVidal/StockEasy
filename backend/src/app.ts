import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import router from './routes';

const app = express();

app.use(express.json());
app.use('/api', router);
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});
app.use(errorHandler);

export default app;

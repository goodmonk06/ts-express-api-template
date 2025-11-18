import { Router, type IRouter } from 'express';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';

const router: IRouter = Router();

router.use(healthRoutes);
router.use('/users', userRoutes);

export default router;

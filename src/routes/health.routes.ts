import { Router, type IRouter } from 'express';
import { healthController } from '../controllers/health.controller';

const router: IRouter = Router();

router.get('/health', (req, res) => healthController.getHealth(req, res));

export default router;

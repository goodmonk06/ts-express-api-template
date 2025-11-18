import { Request, Response } from 'express';
import { healthService } from '../services/health.service';

export class HealthController {
  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      const healthStatus = healthService.getHealthStatus();
      res.status(200).json(healthStatus);
    } catch (_error) {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
}

export const healthController = new HealthController();

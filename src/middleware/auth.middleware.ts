import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { logger } from '../config/logger.config';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ status: 'error', message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string };
      req.userId = decoded.userId;
      next();
    } catch (error) {
      logger.warn(`Invalid token: ${error}`);
      res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    res.status(500).json({ status: 'error', message: 'Authentication failed' });
  }
};

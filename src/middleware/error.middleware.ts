import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  logger.warn(`Route not found: ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Internal server error: ${err.message}\n${err.stack}`);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

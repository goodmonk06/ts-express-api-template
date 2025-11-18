import express, { Application } from 'express';
import routes from './routes';
import { requestLogger } from './middleware/logger.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import express, { Response } from 'express';
import * as Sentry from '@sentry/node';
import cors from 'cors';

import taskRoutes from './routes/taskRoute';
import authRoutes from './routes/authRoute';

import catchAll404Errors from './middlewares/catchAll404Errors';
import globalErrorHandler from './middlewares/errorHandler';
import { connectDatabase } from './configs/prisma';
import { rateLimiter } from './configs/rateLimitConfig';
import MorganSetup from './configs/morganConfig';
import { healthCheck } from './utils/health';

import './configs/sentryConfig';

const app = express();

// connect to DB
connectDatabase();

// Rate limiting - Apply to all requests
app.use(rateLimiter);

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(MorganSetup);

// Routes
app.get('/', async (_, res: Response) => {
  res.status(200).send({
    status: 'success',
    message: 'Api is live',
  });
});

app.use('/health', healthCheck);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get('/debug-sentry', (_, __) => {
  throw new Error('My first Sentry error!');
});

// Error handlers
Sentry.setupExpressErrorHandler(app); // sentry error handler middleware

app.use(catchAll404Errors); // Catch all 404 errors...

app.use(globalErrorHandler); // Catch all errors...

export default app;

import express, { urlencoded } from 'express';
import env from './config/env.js';
import morgan from 'morgan';
import cors from 'cors';
import googleOAuthMiddleware from './middlewares/googleOath.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';

export default function createApp() {
  const app = express();

  // Request logging in development
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Configure CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true,
    })
  );

  // Parse JSON and form data
  app.use(express.json({ limit: '3mb' }));
  app.use(
    urlencoded({
      extended: true,
      limit: '3mb',
    })
  );

  // Configure Google OAuth strategy
  googleOAuthMiddleware(app);

  // Authentication routes
  app.use('/api/auth', authRoutes);

  return app;
}
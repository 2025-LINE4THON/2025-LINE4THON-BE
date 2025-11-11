import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { prisma } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

// Logging (only in development)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/portfolios', portfoliosRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Server startup
const server = app.listen(env.PORT, () => {
  console.log(`
  ================================================
  🚀 Server running in ${env.NODE_ENV} mode
  🌐 URL: http://localhost:${env.PORT}
  📅 Started at: ${new Date().toLocaleString()}
  ================================================
  `);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    await prisma.$disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

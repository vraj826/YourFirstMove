import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import './config/database';
import schedulerService from './services/SchedulerService';
import logger from './config/logger';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Start background jobs
  schedulerService.startNotificationJob();
  schedulerService.startStreakCalculationJob();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  schedulerService.stopAllJobs();
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  schedulerService.stopAllJobs();
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default server;

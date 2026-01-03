import cron from 'node-cron';
import notificationService from './NotificationService';
import analyticsService from './AnalyticsService';
import User from '../models/User';
import logger from '../config/logger';

export class SchedulerService {
  private notificationJob?: cron.ScheduledTask;
  private streakJob?: cron.ScheduledTask;

  startNotificationJob(): void {
    // Run every minute to check for pending notifications
    this.notificationJob = cron.schedule('* * * * *', async () => {
      logger.info('Running notification check...');
      await notificationService.checkPendingNotifications();
    });

    logger.info('Notification job started');
  }

  startStreakCalculationJob(): void {
    // Run daily at midnight to calculate streaks
    this.streakJob = cron.schedule('0 0 * * *', async () => {
      logger.info('Running streak calculation...');
      
      try {
        const users = await User.query();
        
        for (const user of users) {
          await analyticsService.updateStreakData(user.id);
        }
        
        logger.info('Streak calculation completed');
      } catch (error) {
        logger.error('Streak calculation error:', error);
      }
    });

    logger.info('Streak calculation job started');
  }

  stopAllJobs(): void {
    if (this.notificationJob) {
      this.notificationJob.stop();
      logger.info('Notification job stopped');
    }

    if (this.streakJob) {
      this.streakJob.stop();
      logger.info('Streak calculation job stopped');
    }
  }
}

export default new SchedulerService();

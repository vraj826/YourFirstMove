import twilio from 'twilio';
import Task from '../models/Task';
import Notification from '../models/Notification';
import User from '../models/User';
import UserPreference from '../models/UserPreference';
import logger from '../config/logger';

// Make Twilio optional - only initialize if credentials are provided
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || '';
const NOTIFICATION_WINDOW = parseInt(process.env.NOTIFICATION_WINDOW_MINUTES || '30');

let twilioClient: ReturnType<typeof twilio> | null = null;
let twilioEnabled = false;

// Only initialize Twilio if credentials are provided
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    twilioEnabled = true;
    logger.info('Twilio SMS service initialized successfully');
  } catch (error) {
    logger.warn('Twilio initialization failed. SMS notifications will be disabled.', error);
  }
} else {
  logger.warn('Twilio credentials not configured. SMS notifications are disabled.');
}

export class NotificationService {
  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    if (!twilioEnabled || !twilioClient) {
      logger.warn('SMS sending skipped - Twilio not configured');
      return;
    }

    try {
      await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE,
        to: phoneNumber,
      });
      logger.info(`SMS sent to ${phoneNumber}`);
    } catch (error) {
      logger.error('SMS sending error:', error);
      throw error;
    }
  }

  async checkPendingNotifications(): Promise<void> {
    if (!twilioEnabled) {
      return; // Skip if Twilio not configured
    }

    try {
      const now = new Date();
      const windowTime = new Date(now.getTime() + NOTIFICATION_WINDOW * 60000);

      // Find critical tasks due within notification window
      const tasks = await Task.query()
        .where('is_critical', true)
        .where('is_completed', false)
        .where('due_date', '<=', windowTime.toISOString().split('T')[0])
        .whereNotNull('due_time')
        .withGraphFetched('user');

      for (const task of tasks) {
        // Check if notification already sent
        const existingNotification = await Notification.query()
          .where('task_id', task.id)
          .where('status', 'sent')
          .first();

        if (existingNotification) {
          continue;
        }

        // Check user preferences
        const preferences = await UserPreference.query().findOne({ user_id: task.user_id });
        if (preferences && !preferences.notification_enabled) {
          continue;
        }

        const user = task.user as User;
        if (!user.phone_number) {
          logger.warn(`User ${user.id} has no phone number for notification`);
          continue;
        }

        // Calculate task due time
        const taskDueTime = new Date(`${task.due_date}T${task.due_time}`);
        const timeDiff = (taskDueTime.getTime() - now.getTime()) / 60000; // minutes

        const userWindow = preferences?.notification_timing || NOTIFICATION_WINDOW;

        if (timeDiff <= userWindow && timeDiff > 0) {
          await this.scheduleNotification(task, user);
        }
      }
    } catch (error) {
      logger.error('Pending notifications check error:', error);
    }
  }

  async scheduleNotification(task: Task, user: User): Promise<void> {
    try {
      const message = `Reminder: Your critical task "${task.title}" is due at ${task.due_time}. Don't forget!`;

      // Create notification record
      const notification = await Notification.query().insert({
        task_id: task.id,
        user_id: user.id,
        phone_number: user.phone_number!,
        message,
        status: 'pending',
        retry_count: 0,
      });

      // Attempt to send SMS
      try {
        await this.sendSMS(user.phone_number!, message);
        await notification.$query().patch({
          status: 'sent',
          sent_at: new Date(),
        });
      } catch (error) {
        await notification.$query().patch({
          status: 'failed',
          error_message: (error as Error).message,
        });
        await this.retryFailedNotification(notification.id);
      }
    } catch (error) {
      logger.error('Notification scheduling error:', error);
    }
  }

  async retryFailedNotification(notificationId: number): Promise<void> {
    if (!twilioEnabled) {
      return; // Skip if Twilio not configured
    }

    try {
      const notification = await Notification.query().findById(notificationId);
      if (!notification || notification.retry_count >= 3) {
        return;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, notification.retry_count) * 1000;

      setTimeout(async () => {
        try {
          await this.sendSMS(notification.phone_number, notification.message);
          await notification.$query().patch({
            status: 'sent',
            sent_at: new Date(),
            retry_count: notification.retry_count + 1,
          });
        } catch (error) {
          await notification.$query().patch({
            status: 'failed',
            error_message: (error as Error).message,
            retry_count: notification.retry_count + 1,
          });

          if (notification.retry_count + 1 < 3) {
            await this.retryFailedNotification(notificationId);
          }
        }
      }, delay);
    } catch (error) {
      logger.error('Notification retry error:', error);
    }
  }

  isTwilioEnabled(): boolean {
    return twilioEnabled;
  }
}

export default new NotificationService();

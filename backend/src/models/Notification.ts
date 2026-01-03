import { Model } from 'objection';
import Task from './Task';
import User from './User';

export default class Notification extends Model {
  id!: number;
  task_id!: number;
  user_id!: number;
  phone_number!: string;
  message!: string;
  status!: 'pending' | 'sent' | 'failed';
  sent_at?: Date;
  retry_count!: number;
  error_message?: string;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  task?: Task;
  user?: User;

  static tableName = 'notifications';

  static jsonSchema = {
    type: 'object',
    required: ['task_id', 'user_id', 'phone_number', 'message'],
    properties: {
      id: { type: 'integer' },
      task_id: { type: 'integer' },
      user_id: { type: 'integer' },
      phone_number: { type: 'string', maxLength: 20 },
      message: { type: 'string' },
      status: { type: 'string', enum: ['pending', 'sent', 'failed'] },
      sent_at: { type: ['string', 'null'] },
      retry_count: { type: 'integer', minimum: 0 },
      error_message: { type: ['string', 'null'] },
    },
  };

  static relationMappings = () => ({
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: Task,
      join: {
        from: 'notifications.task_id',
        to: 'tasks.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'notifications.user_id',
        to: 'users.id',
      },
    },
  });

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}

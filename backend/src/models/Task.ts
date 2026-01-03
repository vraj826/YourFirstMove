import { Model } from 'objection';
import User from './User';
import Notification from './Notification';

export default class Task extends Model {
  id!: number;
  user_id!: number;
  title!: string;
  description?: string;
  due_date!: string; // Store as string (YYYY-MM-DD)
  due_time?: string;
  end_time?: string;
  priority!: 'low' | 'medium' | 'high' | 'critical';
  is_critical!: boolean;
  is_completed!: boolean;
  completed_at?: Date;
  display_order!: number;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  user?: User;
  notifications?: Notification[];

  static tableName = 'tasks';

  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'title', 'due_date'],
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: ['string', 'null'] },
      due_date: { type: 'string', format: 'date' },
      due_time: { type: ['string', 'null'] },
      end_time: { type: ['string', 'null'] },
      priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      is_critical: { type: 'boolean' },
      is_completed: { type: 'boolean' },
      completed_at: { type: ['string', 'null'] },
      display_order: { type: 'integer' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'tasks.user_id',
        to: 'users.id',
      },
    },
    notifications: {
      relation: Model.HasManyRelation,
      modelClass: Notification,
      join: {
        from: 'tasks.id',
        to: 'notifications.task_id',
      },
    },
  });

  // Parse date from database to string format
  $parseDatabaseJson(json: any) {
    json = super.$parseDatabaseJson(json);
    
    if (json.due_date instanceof Date) {
      json.due_date = json.due_date.toISOString().split('T')[0];
    }
    
    return json;
  }

  // Format date to database format
  $formatDatabaseJson(json: any) {
    json = super.$formatDatabaseJson(json);
    
    // Ensure due_date is in proper format for database
    if (json.due_date && typeof json.due_date === 'string') {
      // Keep as string, database will handle conversion
    }
    
    return json;
  }

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}

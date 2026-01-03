import { Model } from 'objection';
import User from './User';

export default class UserPreference extends Model {
  id!: number;
  user_id!: number;
  theme!: string;
  notification_enabled!: boolean;
  notification_timing!: number;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  user?: User;

  static tableName = 'user_preferences';

  static jsonSchema = {
    type: 'object',
    required: ['user_id'],
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      theme: { type: 'string', maxLength: 50 },
      notification_enabled: { type: 'boolean' },
      notification_timing: { type: 'integer', minimum: 5, maximum: 120 },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'user_preferences.user_id',
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

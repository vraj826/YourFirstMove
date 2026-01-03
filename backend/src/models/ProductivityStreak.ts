import { Model } from 'objection';
import User from './User';

export default class ProductivityStreak extends Model {
  id!: number;
  user_id!: number;
  current_streak!: number;
  longest_streak!: number;
  last_activity_date?: Date;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  user?: User;

  static tableName = 'productivity_streaks';

  static jsonSchema = {
    type: 'object',
    required: ['user_id'],
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      current_streak: { type: 'integer', minimum: 0 },
      longest_streak: { type: 'integer', minimum: 0 },
      last_activity_date: { type: ['string', 'null'], format: 'date' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'productivity_streaks.user_id',
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

import { Model } from 'objection';
import Task from './Task';
import ProductivityStreak from './ProductivityStreak';
import UserPreference from './UserPreference';

export default class User extends Model {
  id!: number;
  email!: string;
  password_hash!: string;
  name!: string;
  phone_number?: string;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  tasks?: Task[];
  productivityStreak?: ProductivityStreak;
  preferences?: UserPreference;

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['email', 'password_hash', 'name'],
    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email', maxLength: 255 },
      password_hash: { type: 'string', maxLength: 255 },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      phone_number: { type: ['string', 'null'], maxLength: 20 },
    },
  };

  static relationMappings = () => ({
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: Task,
      join: {
        from: 'users.id',
        to: 'tasks.user_id',
      },
    },
    productivityStreak: {
      relation: Model.HasOneRelation,
      modelClass: ProductivityStreak,
      join: {
        from: 'users.id',
        to: 'productivity_streaks.user_id',
      },
    },
    preferences: {
      relation: Model.HasOneRelation,
      modelClass: UserPreference,
      join: {
        from: 'users.id',
        to: 'user_preferences.user_id',
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

  // Hide password hash in JSON responses
  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password_hash;
    return json;
  }
}

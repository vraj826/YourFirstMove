import type { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries in dependent tables first
  await knex('user_preferences').del();
  await knex('productivity_streaks').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Inserts seed entries
  const [userId] = await knex('users').insert({
    email: 'testuser@example.com',
    password_hash: passwordHash,
    name: 'Test User',
    phone_number: '1234567890'
  });

  await knex('productivity_streaks').insert({
    user_id: userId,
    current_streak: 2,
    longest_streak: 5
  });

  await knex('user_preferences').insert({
    user_id: userId,
    theme: 'dark',
    notification_enabled: true,
    notification_timing: 30
  });

  console.log('🌱 Seed data inserted successfully: testuser@example.com / password123');
}

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('productivity_streaks', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('current_streak').defaultTo(0);
    table.integer('longest_streak').defaultTo(0);
    table.date('last_activity_date').nullable();
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.unique('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('productivity_streaks');
}

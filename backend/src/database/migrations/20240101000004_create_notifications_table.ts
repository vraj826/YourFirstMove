import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.integer('task_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.string('phone_number', 20).notNullable();
    table.text('message').notNullable();
    table.enum('status', ['pending', 'sent', 'failed']).defaultTo('pending');
    table.timestamp('sent_at').nullable();
    table.integer('retry_count').defaultTo(0);
    table.text('error_message').nullable();
    table.timestamps(true, true);

    table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index(['status', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('notifications');
}

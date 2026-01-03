import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.date('due_date').notNullable();
    table.time('due_time').nullable();
    table.enum('priority', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.boolean('is_critical').defaultTo(false);
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('completed_at').nullable();
    table.integer('display_order').defaultTo(0);
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index(['user_id', 'due_date']);
    table.index(['user_id', 'priority']);
    table.index(['is_critical', 'due_date', 'due_time']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('tasks');
}

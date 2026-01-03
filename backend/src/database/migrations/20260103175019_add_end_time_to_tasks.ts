import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('tasks', (table) => {
    table.time('end_time').nullable().after('due_time');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('tasks', (table) => {
    table.dropColumn('end_time');
  });
}


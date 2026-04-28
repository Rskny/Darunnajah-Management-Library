exports.up = function(knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.timestamp('last_backup_at').nullable(); 
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings');
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('admins', table => {
    // Menambahkan kolom reset_token tipe string yang boleh kosong (nullable)
    table.string('reset_token').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('admins', table => {
    // Menghapus kolom jika migrasi di-rollback
    table.dropColumn('reset_token');
  });
};
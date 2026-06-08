exports.up = function (knex) {
  return knex.schema.createTable('members', table => {
    // Ubah dari table.increments() menjadi table.string() berkode Primary
    table.string('id', 50).primary(); 
    table.string('nama').notNullable();
    table.string('status').notNullable();
    table.string('kelas').notNullable();
    table.string('jurusan').notNullable();
    table.string('gender').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('members');
};
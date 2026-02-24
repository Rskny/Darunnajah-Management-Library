exports.up = function (knex) {
    return knex.schema.createTable('members', table => {
        table.increments('id').primary();
        table.string('nama').notNullable();
        table.string('nis').notNullable().unique();
        table.string('kelas').notNullable();
        table.string('jurusan').notNullable();
        table.string('gender').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('members');
};

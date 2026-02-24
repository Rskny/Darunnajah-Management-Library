exports.up = function (knex) {
    return knex.schema.createTable('visits', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('nis').notNullable();
        table.string('kelas').nullable();
        table.string('chosing').notNullable().defaultTo('Siswa');
        table.string('purpose').notNullable().defaultTo('Membaca');
        table.date('date').notNullable();
        table.string('time').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('visits');
};

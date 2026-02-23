exports.up = function (knex) {
    return knex.schema.createTable('visits', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('nis').notNullable();
        table.date('date').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('visits');
};

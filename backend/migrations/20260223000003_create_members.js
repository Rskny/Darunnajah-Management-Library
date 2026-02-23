exports.up = function (knex) {
    return knex.schema.createTable('members', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('nis').notNullable().unique();
        table.string('class').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('members');
};

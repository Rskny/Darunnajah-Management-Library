exports.up = function (knex) {
    return knex.schema.createTable('admins', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.string('email').notNullable().unique();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('admins');
};

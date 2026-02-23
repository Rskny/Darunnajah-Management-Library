exports.up = function (knex) {
    return knex.schema.createTable('books', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('author').notNullable();
        table.string('category').notNullable();
        table.boolean('available').defaultTo(true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('books');
};

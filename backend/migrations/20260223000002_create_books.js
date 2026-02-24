exports.up = function (knex) {
    return knex.schema.createTable('books', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('author').notNullable();
        table.string('year').notNullable().defaultTo('2025');
        table.string('publisher').notNullable().defaultTo('-');
        table.string('isbn').nullable();
        table.string('category').notNullable();
        table.string('classCode').nullable();
        table.string('major').nullable();
        table.integer('stock').notNullable().defaultTo(1);
        table.string('source').notNullable().defaultTo('Pembelian');
        table.string('inputDate').notNullable().defaultTo('2026-01-01');
        table.string('coverImage').nullable();
        table.boolean('available').defaultTo(true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('books');
};

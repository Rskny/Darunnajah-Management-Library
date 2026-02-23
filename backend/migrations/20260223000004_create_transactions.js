exports.up = function (knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id').primary();
        table.integer('bookId').unsigned().references('id').inTable('books').onDelete('CASCADE');
        table.string('studentName').notNullable();
        table.string('status').notNullable(); // e.g., 'Dipinjam', 'Dikembalikan'
        table.date('borrowDate').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('transactions');
};

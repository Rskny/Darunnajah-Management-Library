exports.up = function (knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id').primary();
        table.integer('bookId').unsigned().references('id').inTable('books').onDelete('CASCADE');
        table.string('studentName').notNullable();
        table.string('role').notNullable().defaultTo('siswa');
        table.string('class').nullable();
        table.string('major').nullable();
        table.string('gender').nullable();
        table.integer('quantity').notNullable().defaultTo(1);
        table.string('status').notNullable(); // e.g., 'Dipinjam', 'Dikembalikan'
        table.date('borrowDate').notNullable();
        table.date('dueDate').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('transactions');
};

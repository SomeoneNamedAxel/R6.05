'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorite_movie', (table) => {

            table.integer('user_id').unsigned().references('id').inTable('user').onDelete('CASCADE');
            table.integer('movie_id').unsigned().references('id').inTable('movie').onDelete('CASCADE');

            table.primary(['user_id', 'movie_id']);

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('favorite_movie');
    }
};

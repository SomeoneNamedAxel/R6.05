'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class FavoriteMovie extends Model {

    static get tableName() {

        return 'favorite_movie';
    }

    static get joiSchema() {

        return Joi.object({
            movie_id: Joi.number().integer().greater(0).example(1).description('Id of the movie'),
            user_id: Joi.number().integer().greater(0).example(1).description('Id of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};

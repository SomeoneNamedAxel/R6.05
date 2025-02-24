'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class MovieService extends Service {
    constructor(server = null) {
        super();
        this.server = server || this.server;
    }

    async create(movie) {

        const {Movie} = this.server.models();

        return Movie.query().insertAndFetch(movie);
    }

    async findAll() {
        if (!this.server) {
            throw new Error('Server instance is required to access models.');
        }

        const { Movie } = this.server.models();
        return Movie.query();
    }

    delete(id){

        const { Movie } = this.server.models();

        return Movie.query().deleteById(id);
    }

    update(id, movie){

        const { Movie } = this.server.models();

        return Movie.query().findById(id).patch(movie);
    }
}
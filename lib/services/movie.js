'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class MovieService extends Service {

    async create(movie) {

        const {Movie} = this.server.models();

        const newMovie = await Movie.query().insertAndFetch(movie);

        return newMovie;
    }

    findAll(){

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
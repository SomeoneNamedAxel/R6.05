'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class FavoriteMovieService extends Service {

    async create(favoriteMovie, userEmail) {

        const {FavoriteMovie} = this.server.models();

        const userId = await this.server.services().userService.getUserIdByEmail(userEmail);

         const existingFavorite = await FavoriteMovie.query().findOne({
            movie_id: favoriteMovie.movie_id,
            user_id: userId
        });

        if (existingFavorite) {
            throw Boom.conflict('This movie is already in your favorites.');
        }

        const movieExists = await this.server.models().Movie.query().findById(favoriteMovie.movie_id);

        if (!movieExists) {
            throw Boom.notFound('The movie does not exist.');
        }

        const newFavoriteMovie = await FavoriteMovie.query().insert({
            movie_id: favoriteMovie.movie_id,
            user_id: userId
        });

        return newFavoriteMovie;
    }

    async findForThisUser(userEmail){

        const { FavoriteMovie } = this.server.models();

        const userId = await this.server.services().userService.getUserIdByEmail(userEmail);

        return FavoriteMovie.query()
            .join('movie', 'favorite_movie.movie_id', 'movie.id')
            .select('movie.*')
            .where({ 'favorite_movie.user_id': userId });
    }

    async delete(movieId, userEmail){

        const { FavoriteMovie } = this.server.models();

        const userId = await this.server.services().userService.getUserIdByEmail(userEmail);

        const favoriteMovieExists = await FavoriteMovie.query().findOne({
            movie_id: movieId,
            user_id: userId
        });

        if (!favoriteMovieExists) {
            throw Boom.notFound('This movie is not in your favorites.');
        }

        return FavoriteMovie.query().delete().where({
            movie_id: movieId,
            user_id: userId
        });
    }

    update(id, favoriteMovie){

        const { FavoriteMovie } = this.server.models();

        return FavoriteMovie.query().patch(favoriteMovie).where({
            movie_id: movieId,
            user_id: userId
        });
    }
}
'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/favorite_movie',
        options: {
            tags:['api'],
            validate: {
                payload: Joi.object({
                    movie_id: Joi.number().integer().required().min(1).example(1).description('Id of the movie'),
                })
            }
        },
        handler: async (request, h) => {

            const { favoriteMovieService } = request.services();

            return await favoriteMovieService.create(request.payload, request.auth.credentials.email);
        }
    },
    {
        method: 'get',
        path: '/favorite_movies',
        options: {
            tags:['api']
        },
        handler: async (request, h) => {

            const { favoriteMovieService } = request.services();

            return await favoriteMovieService.findForThisUser(request.auth.credentials.email);
        }
    },
    {
        method: 'delete',
        path: '/favorite_movie/{id}',
        options: {
            tags:['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteMovieService } = request.services();

            return await favoriteMovieService.delete(request.params.id, request.auth.credentials.email);
        }
    },
    {
        method: 'patch',
        path: '/favorite_movie/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    user_id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    movie_id: Joi.number().integer().required().min(1).example(1).description('Id of the movie'),
                })
            }
        },
        handler: async (request, h) => {

            const { favoriteMovieService } = request.services();

            return await favoriteMovieService.update(request.params.id, request.payload);
        }
    },
]

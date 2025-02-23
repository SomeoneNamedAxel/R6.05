'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            auth : {
                scope : ['admin']
            },
            tags:['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(3).example('The Matrix').description('Title of the movie'),
                    description: Joi.string().required().min(3).example('A Sci-fi movie').description('Description of the movie'),
                    release_date: Joi.date().required().example('1999-03-31').description('Release date of the movie'),
                    director: Joi.string().required().example('The Wachowskis').description('Director of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/movies',
        options: {
            tags:['api']
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.delete(request.params.id);
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    title: Joi.string().required().min(3).example('The Matrix').description('Title of the movie'),
                    description: Joi.string().required().min(3).example('A Sci-fi movie').description('Description of the movie'),
                    release_date: Joi.date().required().example('1999-03-31').description('Release date of the movie'),
                    director: Joi.string().required().example('The Wachowskis').description('Director of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.update(request.params.id, request.payload);
        }
    },
]

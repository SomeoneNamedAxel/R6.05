'use strict';

const Joi = require('joi')
const amqp = require("amqplib");  // pour RabbitMQ

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

            const { movieService, emailService } = request.services();

            await emailService.sendNewMovieEmail(request.payload.title);

            return movieService.create(request.payload);
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

            const { movieService, emailService } = request.services();

            await emailService.sendUpdatedMovieEmail(request.params.id, request.payload.title);

            return await movieService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'post',
        path: '/movie/export',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            try {
                const connection = await amqp.connect("amqp://localhost");
                const channel = await connection.createChannel();

                const queue = 'export_csv_queue';

                await channel.assertQueue(queue, { durable: true });

                const message = JSON.stringify({
                    email: request.auth.credentials.email,
                    request_type: 'full_export'
                });


                console.log(`Sending message to RabbitMQ queue: ${queue}, message: ${message}`);
                channel.sendToQueue(queue, Buffer.from(message));

                await channel.close();
                await connection.close();


                return h.response({ message: "Export of films successfully requested." }).code(200);



            } catch (error) {
                console.error("Error while sending RabbitMQ message:", error);
                return h.response({ error: "An error occurred during the export." }).code(500);
            }
        }
    }
]

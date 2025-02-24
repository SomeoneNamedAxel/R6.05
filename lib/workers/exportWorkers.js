const amqp = require('amqplib');
const MovieService = require('../services/movie');

async function exportMovies() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'export_csv_queue';

        channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, async (msg) => {
            const content = JSON.parse(msg.content.toString());
            console.log('Received export request for all movies:', content);

            const movieService = new MovieService(content.server);

            try {
                const movies = await movieService.findAll();
                console.log('Movies fetched:', movies);

                channel.ack(msg);
            } catch (error) {
                console.error('Error during movie export:', error);
                channel.nack(msg);
            }
        });

    } catch (error) {
        console.error('Error with RabbitMQ connection:', error);
    }
}

exportMovies();

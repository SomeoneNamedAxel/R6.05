'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();

        const newUser = await User.query().insertAndFetch(user);

        const emailService = this.server.services().emailService;
        try {
            await emailService.sendWelcomeEmail(newUser.email, newUser.firstName, newUser.password);
        } catch (error) {
            console.error("An error occurred upon sending the email: ", error);
        }

        return newUser;
    }

    findAll(){

        const { User } = this.server.models();

        return User.query();
    }

    delete(id){

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    update(id, user){

        const { User } = this.server.models();

        return User.query().findById(id).patch(user);
    }

    async login(email, password) {

        const { User } = this.server.models();

        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                scope: user.roles
            },
            {
                key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return token;
    }

    getUserIdByEmail(email) {

        const { User } = this.server.models();

        return User.query().findOne({ email }).then(user => {
            if (!user) {
                throw Boom.notFound('User not found');
            }

            return user.id;
        });
    }

    getAllUsers(){

        const { User } = this.server.models();

        return User.query();
    }

    getUsersFromFavoriteMovie(movieId){
        const { User } = this.server.models();

        return User.query()
            .join('favorite_movie', 'favorite_movie.user_id', 'user.id')
            .select('user.*')
            .where({ 'favorite_movie.movie_id': movieId });
    }
}

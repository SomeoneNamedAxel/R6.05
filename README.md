# iut-project

## Description

This is a backend application that mimics a movie library.

## Installation

Run the following command to install the required packages:
```bash
npm install
```

In a .env file at the root of the project, add the following variables:
```bash
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<generated email>
SMTP_PASSWORD=<generated password>
```
The user described here will be the application's mail sender, please refer to it to see the emails sent by the application. Go to ethereal email to generate an email and a password, and copy/paste it here.

mysql required, please refer to the manifest file for the database configuration.

Run the migrations:
```bash
npx knex migrate:latest
```

Install rabbitMQ:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

To start the server:
```bash
node server
```

## Usage

### RabbitMQ
http://localhost:15672/
- username: guest
- password: guest


### Routes

Go to http://localhost:3000/documentation to view all the routes that can be used (powered by Swagger).
You can also use Postman if you encounter problems with the bearer token, in both case, you will have to copy/paste the token from the user login route's response to the restricted routes when authentification is asked.
Some actions require a specific "admin" role, you can set it in the database at column "roles" in "user" table, by adding "admin" as the second list index.

#### User
- .../user (POST): Create a user. A welcome email is sent at the user's email address.
- .../user/login (POST): Login as a user, it will return a bearer token, keep it.
- .../user/{id} (DELETE): Delete a user (admin role required).
- .../user/{id} (PATCH): Edit a user (admin role required).
- .../users (GET): Get all users.

#### Movie
- .../movie (POST): Create a movie (admin role required). All users will be notified by email.
- .../movies (GET): Get all movies.
- .../movie/{id} (DELETE): Delete a movie.
- .../movie/{id} (PATCH): Edit a movie (admin role required).
- .../movie/export (POST): Send a .csv file by email containing all movies (NOT WORKING)

#### Favorite Movie
- .../favorite_movie (POST): Add a movie to the user's favorite list using the movie's id.
- .../favorite_movies (GET): Get all the user's favorite movies (with titles, descriptions, etc. for clarity).
- .../favorite_movie/{id} (DELETE): Remove a movie from the user's favorite list.
- .../favorite_movie/{id} (PATCH): Edit a movie from the user's favorite list. All users that have this movie as favorite will be notified by email.

### To view mail transfer
- go to ethereal email, and login as the user in .env.
- note: You can only see sent emails in ethereal email, not received one, that's why you have to log in as the "server sender"

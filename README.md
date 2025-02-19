# iut-project

## Description

This backend application

## Installation

Run the following command to install the required packages:
```bash
npm install
```

mysql required, please refer to the manifest file for the database configuration.

Run the migrations:
```bash
npx knex migrate:latest
```

To start the server:
```bash
node server
```

## Usage

The use of Postman is highly recommended.

### To register a user (POST):
- url: http://localhost:3000/user/
- body (json): 
  - email
  - password
  - username
  - firstname
  - lastname
- response: an access token + a welcome email at the provided email (use ethereal email)

### To login:
- url http://localhost:3000/user/login 
- body (json):
    -email
    -password
- response: an access token


Todo/ Task management System

Installation

1. install the dependencies using npm install
2. configure the mongoserverurl, username, password of the sender mail in env file
3. Change the port jwtkey and db, collection names in the config file
4. start the server

Project Structure

1. _config folder holds the config files required for the projects
2. _core folder holds the basic functionality files like router js, authenticate js, dboperartions etc
3. cms folder holds the api of the application
4. _model folder holds the Structure of the user and task 
5. .env file holds the mongoserverurl and username and password of the gmail account

API:

1. POST Register - API to register a new user
2. POST Login - API to Login to the application
3. GET tasks - API to get all the tasks assigned to the user or to his/her team
4. POST tasks - API to add a new Task
5. PUT tasks - API to update a new Task
6. DELETE tasks - API to delete a new Task



All the api's other than the Login and register api are validated using jsonwebtoken
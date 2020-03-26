var bodyParser = require('body-parser'),
    express = require('express'),
    router = express.Router();
var authenticate = require("./authenticate"),
    tasks = require('./tasks')
module.exports = function (io) {
    router.use(bodyParser.urlencoded({
        limit: '5mb',
        extended: true
    })) // parse application/x-www-form-urlencoded
    router.use(bodyParser.json({
        type: 'application/json'
    })) // parse application/json
    router.post('/user/login', function (req, res, next) {
        var api = require('../cms/api/post/login')
        api.process(req, res)
            .then(function (data) {
                res.redirect('/tasks')
                // res.send(data).end();
            })
            .catch(function (err) {
                res.send(err).end();
            });
    });
    router.post('/user/register', function (req, res, next) {
        var api = require('../cms/api/post/register')
        api.process(req, res)
            .then(function (data) {
                res.send(data).end();
            })
            .catch(function (err) {
                res.send(err).end();
            });
    });
    router.use(authenticate)
    tasks(router)
    return router;
}
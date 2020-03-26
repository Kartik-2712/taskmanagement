const initializetasks = function (router) {
    router.get('/tasks', function (req, res, next) {
        var api = require('../cms/api/get/task')
        api.process(req)
            .then(function (data) {
                res.send(data).end();
            })
            .catch(function (err) {
                res.send(err).end();
            });
    });
    router.post('/tasks', function (req, res, next) {
        var api = require('../cms/api/post/task')
        api.process(req)
            .then(function (data) {
                res.send(data).end();
            })
            .catch(function (err) {
                res.send(err).end();
            });
    });
    router.put('/tasks/:id', function (req, res, next) {
        var api = require('../cms/api/put/task')
        api.process(req)
            .then(function (data) {
                res.send(data).end();
            })
            .catch(function (err) {
                res.send(err).end();
            });
    });
    router.delete('/tasks/:id', function (req, res, next) {
        var api = require('../cms/api/delete/task')
        api.process(req)
            .then(function (data) {
                res.send(data).end();
            })
            .catch(function (err) {
                res.send(err).end();
            });
    });
}

module.exports = initializetasks;
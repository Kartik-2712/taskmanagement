var bodyParser = require('body-parser'),
    compression = require('compression'),
    config = require('./_config/config.json'),
    express = require('express')

    //, favicon = require('serve-favicon')
    ,
    helmet = require('helmet'),
    session = require('express-session');
require('dotenv').config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var sessionOptions = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    rolling: true
};

global.config = config
var app = express(); // call the express framwork
// set the required headers
app.use(helmet());
// deliver compressed content
app.use(compression());
// set the sessions
app.use(session(sessionOptions));
// display favicon
// app.use(favicon(path.join(__dirname, 'cms', 'images', 'favicons', 'favicon.ico')))


// app exit normally
process.on('exit', function () {
    console.log('Shutting down...');
    process.exit();
});

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
    console.log('Force quitting...');
    process.exit();
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', function (e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit();
});

var appServer = require('http').createServer(app).listen(config.port, function () {
    console.log('                            +-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
    console.log('                            |   S t a t u s M o n   1.0 |');
    console.log('                            +-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
    console.log('');
    console.log('process environment    : ' + (process.env.NODE_ENV || 'development'));
    console.log('listening on port      : ' + config.port);
    console.log(config.projectName + ' is ready ...');
    var io = require('socket.io').listen(appServer);
    var routers = require('./_core/routers.js')(io);
    app.use(routers); // call the controllers
});

/**
 * Module dependencies.
 */
var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

var db = require('rethinkdb');

var utils = require('./utils/extends');
console.log('utils', utils);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static('WebContent'));
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// specific / path
//app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/', express.static(path.join(__dirname)));

// bind db service
var db = new (require('./dbinit/dbservice'))(r);
app.get('/db', db.serve);

// init database
var r = require('rethinkdb');
var init = require('./dbinit/dbinit');
init.create(r).connect('localhost', 28015, 'blockdb').task(function () {
    console.log('all ends');
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}).start();


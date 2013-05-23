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


var r = require('rethinkdb');

// init database
var init = require('./dbinit/init');
init.create(r).connect('localhost', 28015, 'blockdb').start();

// bind db service
var db = new (require('./dbinit/querys'))(r);
app.get('/db', db.queryTables);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

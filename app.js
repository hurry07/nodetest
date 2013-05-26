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
app.use(express.cookieParser());
//app.use(express.bodyParser());
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
var dbconf = require('./dbinit/dbconf')(r).host('localhost').port(28015).db('blockdb');

var dbService = require('./dbinit/dbservice').create(dbconf);
app.post('/db', express.bodyParser(), dbService.serve);

//// init database and start server
//var init = require('./dbinit/dbinit');
//init.create(dbconf).task(function () {
//    console.log('all ends');
//    http.createServer(app).listen(app.get('port'), function () {
//        console.log('Express server listening on port ' + app.get('port'));
//    });
//}).start();

var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true}, 10);
var db = new mongodb.Db("mydb2", server, {safe: true});
db.open(function (err, db) {
    if (err) {
        console.log(err);
    }
    if (!err) {
        console.log("we are connected!");
    }
});

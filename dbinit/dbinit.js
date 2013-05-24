var extend = require('../utils/extends');
var miscellaneous = require('../utils/miscellaneous');

var sequence = require('../utils/sequence');
function dbAdapter(r) {
    sequence.call(this);
    this.r = r;
    this.task(this.connectDB, this);
    this.task(this.listDB, this, 'conn');
    this.task(this.createDB, this, 'dblist', 'conn');
    this.task(this.listTables, this, 'conn');
    this.task(this.createTables, this, 'tables', 'conn');
    this.task(this.close, this, 'conn');
}
extend.extend(dbAdapter, sequence);
dbAdapter.prototype.checkError = function () {
    console.log('dbAdapter.prototype.checkError');
    if (this.param('err')) {
        this.stop();
    } else {
        this.next();
    }
}
dbAdapter.prototype.connectDB = function () {
    this.r.connect({host: 'localhost', port: 28015, db: 'blockdb'}, this.callback('!err', 'conn'));
}
dbAdapter.prototype.connect = function (host, port, db) {
    this.connect = {host: host, port: port, db: db};
    return this;
}
/**
 * create db if not exits
 * @param conn
 */
dbAdapter.prototype.listDB = function (conn) {
    var r = this.r;
    var db = this.connect.db;
    r.dbList().run(conn, this.callback('err', 'dblist'));
}
dbAdapter.prototype.createDB = function (dblist, conn) {
    var db = this.connect.db;
    var col = miscellaneous.createlist(dblist);
    if (col.has(db)) {
        console.info('dbCreate directly:');
        this.next();
    } else {
        this.r.dbCreate(db).run(conn, this.callback('err'));
    }
}
/**
 * create tables if not exits
 */
dbAdapter.prototype.listTables = function (conn) {
    console.log('listTables');
    var db = this.connect.db;
    this.r.db(db).tableList().run(conn, this.callback('err', 'tables'));
}
dbAdapter.prototype.createTables = function (tables, conn) {
    console.log('createTables >');
    var col = miscellaneous.createlist(tables);
    var tables = [
        {name: 'module'},
        {name: 'table'},
        {name: 'link'},
        {name: 'data'}
    ];

    var db = this.connect.db;
    var r = this.r;

    // do next step when all table was created successfully
    miscellaneous.each(tables, function (table) {
        if (col.has(table.name)) {
            console.info('dbCreate directly:');
            this.tick();
        } else {
            col.add(table.name);
            if (table.param) {
                r.db(db).tableCreate(table.name, table.param).run(conn, this.tick);
            } else {
                r.db(db).tableCreate(table.name).run(conn, this.tick);
            }
        }
    }, sequence.counter(tables.length, function () {
        this.next();
    }, this));
}
dbAdapter.prototype.close = function (conn) {
    conn.close();
    this.next();
}
exports.create = function (r) {
    var a = new dbAdapter(r);
    return a;
};
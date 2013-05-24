var extend = require('../utils/extends');

function collect(array) {
    this.array = array;
}
collect.prototype.has = function (name) {
    for (var i = 0, len = this.array.length; i < len; i++) {
        if (this.array[i] == name) {
            return true;
        }
    }
    return false;
}
collect.prototype.add = function (name) {
    this.array.push(name);
}
collect.prototype.each = function (fn, bind) {
    for (var i = 0, len = this.array.length; i < len; i++) {
        fn.call(bind || this.array, this.array[i], i);
    }
}

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
/**
 * save params by name form current context
 * @returns {Function}
 */
dbAdapter.prototype.callback = function () {
    var names = Array.prototype.slice.call(arguments, 0);
    var seq = this;
    return function () {
        for (var i = 0, len = names.length; i < len; i++) {
            var n = names[i];
            if (n.indexOf('!') == 0 && arguments[i]) {
                seq.stop();
                return;
            }
            seq.param(n, arguments[i]);
        }
        seq.next();
    }
}
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
    r.dbList().run(conn, this.prepare('err', 'dblist'));
}
dbAdapter.prototype.createDB = function (dblist, conn) {
    var db = this.connect.db;
    var col = new collect(dblist);
    if (col.has(db)) {
        console.info('dbCreate directly:');
        this.next();
    } else {
        this.r.dbCreate(db).run(conn, this.prepare('err'));
    }
}
/**
 * create tables if not exits
 */
dbAdapter.prototype.listTables = function (conn) {
    console.log('listTables');
    var db = this.connect.db;
    this.r.db(db).tableList().run(conn, this.prepare('err', 'tables'));
}
dbAdapter.prototype.createTables = function (tables, conn) {
    console.log('createTables >');
    var col = new collect(tables);
    var tables = [
        {name: 'module'},
        {name: 'table'},
        {name: 'link'},
        {name: 'data'}
    ];

    var seq = this;
    var callback = function (err, message) {
        console.log(arguments);
        if (err) {
            seq.stop();
        } else {
            waiting--;
        }
        if (waiting == 0) {
            console.log('all table created inner');
            seq.next();
        }
    }
    var waiting = tables.length;
    var db = this.connect.db;
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        if (col.has(table.name)) {
            console.info('dbCreate directly:');
            waiting--;
        } else {
            col.add(table.name);
            if (table.param) {
                this.r.db(db).tableCreate(table.name, table.param).run(conn, callback);
            } else {
                this.r.db(db).tableCreate(table.name).run(conn, callback);
            }
        }
    }
    if (waiting == 0) {
        console.log('all table created');
        this.next();
    }
}
dbAdapter.prototype.close = function (conn) {
    conn.close();
    this.next();
}
exports.create = function (r) {
    var a = new dbAdapter(r);
    return a;
};
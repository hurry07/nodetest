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
collect.prototype.each = function (fn, bind) {
    for (var i = 0, len = this.array.length; i < len; i++) {
        fn.call(bind || this.array, this.array[i], i);
    }
}

function init(r) {
    this.r = r;
    console.log('init running');
}
init.prototype.start = function () {
    var _this = this;
    this.r.connect({host: 'localhost', port: 28015, db: 'blockdb'}, function (err, conn) {
        console.log('connect', arguments);
        _this.initDB(conn);
        _this.initTables(conn);
        conn.close();
    });
}
init.prototype.connect = function (host, port, db) {
    this.connect = {host: host, port: port, db: db};
    return this;
}
init.prototype.initDB = function (conn) {
    var r = this.r;
    var db = this.connect.db;
    r.dbList().run(conn, function (err, dblist) {
        if (err) {
            console.err('dbList error:', err);
        } else {
            var col = new collect(dblist);
            col.has(db) || r.dbCreate(db).run(conn, function () {
                console.info('dbCreate:', arguments);
            });
        }
    });
}
init.prototype.initTables = function (conn) {
    console.log('init tables');
    this.r.tableCreate('test111').run(conn, function () {
        console.log('create table', arguments);
    });
}
exports.create = function (r) {
    return new init(r);
};
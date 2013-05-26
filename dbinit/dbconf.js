function conf(r) {
    this.r = r;
    this._host = 'localhost';
    this._port = 28015;
    this._db = 'blockdb';
}
conf.prototype.host = function (host) {
    if (arguments.length == 0) {
        return this._host;
    }
    this._host = host;
    return this;
}
conf.prototype.port = function (port) {
    if (arguments.length == 0) {
        return this._port;
    }
    this._port = port;
    return this;
}
conf.prototype.db = function (db) {
    if (arguments.length == 0) {
        return this._db;
    }
    this._db = db;
    return this;
}
conf.prototype.connect = function (callback) {
    this.r.connect({host: this._host, port: this._port, db: this._db}, callback);
}
conf.prototype.usedb = function () {
    return this.r.db(this._db);
}
conf.prototype.getR = function () {
    return this.r;
}
module.exports = function (r) {
    return new conf(r);
}
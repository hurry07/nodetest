function init(r) {
    console.log('init running');
    r.connect({host: 'localhost', port: 28015, db: 'marvel'}, function (err, conn) {
        console.log('connect', arguments);
        initTables(r, conn);
        conn.close();
    });
}
function initTables(r, conn) {
    r.dbList().run(conn, function () {
        console.log(arguments);
    });
    console.log('init tables');
    r.tableCreate('test111').run(conn, function () {
        console.log('create table', arguments);
    });
}
exports.init = init;
function dbService(r) {
    this.r = r;
}
dbService.prototype.queryTables = function (req, res) {
    console.log('execute query');
    res.json({ready: 'OK'});
}
dbService.prototype.serve = function (req, res) {
    var body = req.body;
    var table = body.table;
    var id = body.id;
    if (!body.id) {

    }
    console.log('execute query', req.body);
    res.json({status: 'OK'});
}
exports.create = function (dbconf) {
    return new dbService(dbconf);
};

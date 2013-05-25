function dbService(r) {
    this.r = r;
}
dbService.prototype.queryTables = function (req, res) {
    console.log('execute query');
    res.json({ready: 'OK'});
}
dbService.prototype.serve = function (req, res) {
    console.log('execute query', req.body);
    res.json({ready: 'OK'});
}
module.exports = dbService;

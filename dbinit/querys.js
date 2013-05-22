function Query(r) {
    this.r = r;
}
Query.prototype.queryTables = function (req, res) {
    console.log('execute query');
    res.json({ready: 'OK'});
}
module.exports = Query;

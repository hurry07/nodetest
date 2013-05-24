function each(array, fn, bind) {
    for (var i = 0, length = array.length; i < length; i++) {
        fn.call(bind || array, array[i], i);
    }
}
function list(array) {
    this.array = array;
}
list.prototype.has = function (name) {
    for (var i = 0, len = this.array.length; i < len; i++) {
        if (this.array[i] == name) {
            return true;
        }
    }
    return false;
}
list.prototype.add = function (name) {
    this.array.push(name);
}

exports.each = each;
exports.createlist = function (array) {
    return new list(array);
};
function sequence() {
    this.tasks = [];
    this.context = {};
    this.index = 0;
}
/**
 * add a task to sequence
 *
 * @param fn
 * @param bind an object used as this when run fn
 * @param params param names
 */
sequence.prototype.task = function (fn, bind, params) {
    if (typeof bind == 'string') {
        params = Array.prototype.slice.call(arguments, 1);
        bind = null;
    } else {
        params = Array.prototype.slice.call(arguments, 2);
    }
    this.tasks.push({fn: fn, bind: bind, params: params});
}
sequence.prototype.param_ = function (name) {
    delete this.context[name];
}
sequence.prototype.param = function (name, value) {
    if (arguments.length == 1) {
        return this.context[name];
    } else {
        this.context[name] = value;
    }
}
sequence.prototype.next = function () {
    this.index++;
    this.start();
}
sequence.prototype.stop = function () {
    this.index = this.tasks.length;
}
sequence.prototype.start = function () {
    if (this.index < this.tasks.length) {
        var task = this.tasks[this.index];
        var params = [];
        for (var i = 0, names = task.params, len = names.length; i < len; i++) {
            params.push(this.context[names[i]]);
        }
        task.fn.apply(task.bind || this, params);
    }
}

module.exports = sequence;
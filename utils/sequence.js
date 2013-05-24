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
    return this;
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
/**
 * collect param and call next task
 * @returns {Function}
 */
sequence.prototype.callback = function () {
    var names = Array.prototype.slice.call(arguments, 0);
    var seq = this;
    return function () {
        for (var i = 0, len = names.length; i < len; i++) {
            seq.param(names[i], arguments[i]);
        }
        seq.next();
    }
}
sequence.prototype.next = function () {
    this.index++;
    console.log('next ->', this.index, this.tasks.length);

    var seq = this;
    process.nextTick(function () {
        seq.start();
    });
}
sequence.prototype.stop = function () {
    this.index = this.tasks.length;
}
sequence.prototype.start = function () {
    if (this.index < this.tasks.length) {
        this.run(this.tasks[this.index]);
    }
}
sequence.prototype.run = function (task) {
    var params = [];
    for (var i = 0, names = task.params || [], len = names.length; i < len; i++) {
        params.push(this.context[names[i]]);
    }
    task.fn.apply(task.bind || this, params);
}
/**
 * return a count down object with a finally function fn
 *
 * @param count total count
 * @param fn called when finally
 * @param bind fn binding context
 * @returns {{tick: Function}}
 */
function counter(count, fn, bind) {
    return {
        tick: function () {
            if (--count == 0) {
                fn.call(bind || this);
            }
        }
    }
}
module.exports = sequence;
module.exports.counter = counter;
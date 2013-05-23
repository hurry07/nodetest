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
    if (this.index == this.tasks.length) {
        console.log('start ---->', this.index, this.tasks.length);
        var trigger = this.endTrigger;
        if (trigger) {
            this.run(trigger);
        }
        return;
    }
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
sequence.prototype.trigger = function (fn, bind, params) {
    this.endTrigger = {fn: fn, bind: bind, params: params};
    return this;
}

module.exports = sequence;
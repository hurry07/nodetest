function extend(sub, super_, props) {
    sub.prototype = Object.create(super_.prototype);
    if (props) {
        for (var i in props) {
            sub.prototype[i] = props[i];
        }
    }
    sub.prototype.constructor = sub;
    return sub;
}

function defineClass(super_, props) {
    props = props || {};
    var sub = getOwnProperty(props, 'constructor') || function () {
        super_.apply(this, arguments);
    };
    sub.prototype = Object.create(super_.prototype);
    if (props) {
        for (var i in props) {
            sub.prototype[i] = props[i];
        }
    }
    sub.prototype.constructor = sub;
    return sub;
}
function getOwnProperty(o, p) {
    if (o.hasOwnProperty(p)) {
        return o[p];
    }
    return undefined;
}

module.exports = {extend: extend, defineClass: defineClass}

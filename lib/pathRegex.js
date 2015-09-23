"use strict";

function PathRegexp(path, sensitive, strict) {
    if (toString.call(path) == '[object RegExp]') return path;
    if (Array.isArray(path)) path = '(' + path.join('|') + ')';
    var keys = [];
    path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '')
        + (star ? '(/*)?' : '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
    this.keys = keys;
    this.regexp = new RegExp('^' + path + '$', sensitive ? '' : 'i');
};

PathRegexp.prototype.match = function (path) {
    this.params = [];
    var m = this.regexp.exec(path);
    if (!m) {
        return false;
    }
    for (var i = 1, len = m.length; i < len; ++i) {
        var key = this.keys[i - 1];
        var val = m[i];

        if (key) {
            this.params[key.name] = val;
        } else {
            this.params.push(val);
        }
    }

    return true;
};

PathRegexp.prototype.group = function (name) {
    return this.params[name];
};

exports = module.exports = PathRegexp;
"use strict";

function PathRegexp(path, sensitive, strict) {
    if (toString.call(path) == "[object RegExp]") return path;
    if (Array.isArray(path)) path = "(" + path.join("|") + ")";
    var keys = [];
    path = path
    .concat(strict ? "" : "/?")
    .replace(/\/\(/g, "(?:/")
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
        keys.push({ name: key, optional: !!optional });
        slash = slash || "";
        return ""
        + (optional ? "" : slash)
        + "(?:"
        + (optional ? slash : "")
        + (format || "") + (capture || (format && "([^/.]+?)" || "([^/]+?)")) + ")"
        + (optional || "")
        + (star ? "(/*)?" : "");
    })
    .replace(/([\/.])/g, "\\$1")
    .replace(/\*/g, "(.*)");
    this.keys = keys;
    this.regexp = new RegExp("^" + path + "$", sensitive ? "" : "i");
};

PathRegexp.prototype.match = function (path) {
    var m = this.regexp.exec(path);
    if (!m) return false;
    return true;
};

PathRegexp.prototype.getParams = function (path) {
    var params = [];
    
    var m = this.regexp.exec(path);
    if (!m) params;

    for (var i = 1, len = m.length; i < len; ++i) {
        var key = this.keys[i - 1];
        var val = m[i];

        if (key) params[key.name] = val;
        else params.push(val);
    }

    return params;
};

PathRegexp.prototype.group = function (name) {
    return this.params[name];
};

exports = module.exports = PathRegexp;
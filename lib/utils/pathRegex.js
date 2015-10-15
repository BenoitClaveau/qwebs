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
    var result = {
        match: false,
        params: {}
    };
    
    var m = this.regexp.exec(path);
    if (!m) return result;

    result.match = true;
    
    for (var i = 1, len = m.length; i < len; ++i) {
        var key = this.keys[i - 1];
        var val = m[i];

        if (key) result.params[key.name] = val;
        else {
            key = Object.keys(result.params).length;
            result.params[key] = val;
        }
    }

    return result;
};

exports = module.exports = PathRegexp;
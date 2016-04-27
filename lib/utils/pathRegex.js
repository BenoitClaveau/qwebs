"use strict";

class PathRegexp {
    constructor(path, sensitive, strict) {
        if (path == "[object RegExp]") return path;
        if (Array.isArray(path)) path = "(" + path.join("|") + ")";
        let keys = [];
        
        path = path
            .concat(strict ? "" : "/?")
            .replace(/\/\(/g, "(?:/")
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, (_, slash, format, key, capture, optional, star) => {
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

    match(path) {
        let result = {
            match: false,
            params: {}
        };
        
        let m = this.regexp.exec(path);
        if (!m) return result;

        result.match = true;
        
        let count = m.length;
        for (let i = 1; i < count; i++) {
            let key = this.keys[i - 1];
            let val = m[i];

            if (key) result.params[key.name] = val;
            else {
                key = Object.keys(result.params).length;
                result.params[key] = val;
            }
        }
        return result;
    };
};

exports = module.exports = PathRegexp;
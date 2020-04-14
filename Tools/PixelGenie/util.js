if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
function GetSubClasses(type, ignoreExtendedClasses) {
    var allSubclasses = Object.keys(window).map(function (prop) { return window[prop]; }).filter(function (o) { return o && o.prototype && o.prototype instanceof type; });
    if (ignoreExtendedClasses) {
        allSubclasses = allSubclasses.filter(function (c) { return !HasSubClasses(c); });
    }
    return allSubclasses;
}
function HasSubClasses(type) {
    return Object.keys(window).map(function (prop) { return window[prop]; }).filter(function (o) { return o && o.prototype && o.prototype instanceof type; }).length > 0;
}
function RandBetween(min, max) {
    return Math.random() * (max - min) + min;
}
function WeightedAvg(a, b, weightToB) {
    return a * (1 - weightToB) + b * weightToB;
}
// How is this not built-in functionality?
// https://stackoverflow.com/questions/1007981
function GetFuncArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
        .replace(/=[^,]+/g, '') // strip any ES6 defaults  
        .split(',').filter(Boolean); // split & filter [""]
}
function Create(objectName, args) {
    return new ((_a = window[objectName]).bind.apply(_a, [void 0].concat(args)))();
    var _a;
}
//# sourceMappingURL=util.js.map
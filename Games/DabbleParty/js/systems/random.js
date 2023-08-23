"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Random = /** @class */ (function () {
    function Random() {
    }
    Random.SetSeed = function (seed) {
        this._seed = seed;
    };
    Random.GetRand = function () {
        Random._seed++;
        return Math.abs(1000 * Math.sin(Random._seed)) % 1;
    };
    Random.GetRandInt = function (lowestInt, highestInt) {
        lowestInt = Math.floor(lowestInt);
        highestInt = Math.floor(highestInt);
        var rand = Random.GetRand();
        var range = highestInt - lowestInt + 1;
        return lowestInt + Math.ceil(rand * range) - 1;
    };
    Random.GetRandIntFrom1ToNum = function (highestInt) {
        return Random.GetRandInt(1, highestInt);
    };
    Random.RandFrom = function (list) {
        if (list.length == 0) {
            throw "RandFrom called on empty list";
        }
        if (list.length == 1)
            return list[0];
        var index = Random.GetRandInt(0, list.length - 1);
        return list[index];
    };
    Random.GetShuffledCopy = function (list) {
        var ret = [];
        var copy = __spreadArrays(list);
        for (var i = 0; i < list.length; i++) {
            var indexToRemove = Random.GetRandInt(0, copy.length - 1);
            var el = copy.splice(indexToRemove, 1)[0];
            ret.push(el);
        }
        return ret;
    };
    Random._seed = 1;
    return Random;
}());

"use strict";
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
    Random._seed = 1;
    return Random;
}());

"use strict";
// pseudo random number gen for things that could technically affect level outcome (hazard particle direction)
var Random = /** @class */ (function () {
    function Random() {
    }
    Random.Reset = function () {
        this.seed = 0;
    };
    Random.random = function () {
        var seed = this.seed;
        this.seed++;
        return Math.abs(Math.sin(seed) * 100000) % 1;
    };
    Random.seed = 0;
    return Random;
}());

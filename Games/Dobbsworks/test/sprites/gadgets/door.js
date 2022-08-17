"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Door = /** @class */ (function (_super) {
    __extends(Door, _super);
    function Door() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.frame = 0;
        return _this;
    }
    Door.prototype.GetPairedDoor = function () {
        var _this = this;
        var allDoors = this.layer.sprites.filter(function (a) { return a instanceof Door && a != _this; });
        if (allDoors.length == 0)
            return null;
        if (allDoors.length == 1)
            return allDoors[0];
        var doorHorizontalDistances = allDoors.map(function (a) { return Math.abs(a.x - _this.x); });
        doorHorizontalDistances.sort();
        var minHorizontalDistance = doorHorizontalDistances[0];
        // grab all doors that are tied for closest horizontally
        var closestDoorsHorizontally = allDoors.filter(function (a) { return Math.abs(a.x - _this.x) == minHorizontalDistance; });
        if (closestDoorsHorizontally.length == 1)
            return closestDoorsHorizontally[0];
        var doorVerticalDistances = allDoors.map(function (a) { return Math.abs(a.y - _this.y); });
        var minVerticalDistance = doorVerticalDistances[0];
        // grab all doors that are tied for closest vertically AND horizontally
        var closestDoors = closestDoorsHorizontally.filter(function (a) { return Math.abs(a.y - _this.y) == minVerticalDistance; });
        if (closestDoors.length == 1)
            return closestDoors[0];
        closestDoors.sort(function (a, b) { return (a.x - b.x) * 100000 + (a.y - b.y); });
        return closestDoors[0];
    };
    Door.prototype.Update = function () {
    };
    Door.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["door"][this.frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Door;
}(Sprite));

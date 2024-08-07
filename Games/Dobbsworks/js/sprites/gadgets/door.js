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
        _this.originalX = -1;
        _this.originalY = -1;
        return _this;
    }
    Door.prototype.GetPairedDoor = function () {
        var _this = this;
        var allDoors = this.layer.sprites.filter(function (a) { return a instanceof Door && a != _this; });
        if (allDoors.length == 0)
            return null;
        if (allDoors.length == 1)
            return allDoors[0];
        var doorHorizontalDistances = allDoors.map(function (a) { return Math.abs(a.originalX - _this.originalX); });
        if (Version.DoesCurrentLevelUseOldDoorPairing()) {
            doorHorizontalDistances.sort();
        }
        else {
            doorHorizontalDistances.sort(function (a, b) { return a - b; });
        }
        var minHorizontalDistance = doorHorizontalDistances[0];
        // grab all doors that are tied for closest horizontally
        var closestDoorsHorizontally = allDoors.filter(function (a) { return Math.abs(a.originalX - _this.originalX) == minHorizontalDistance; });
        if (closestDoorsHorizontally.length == 1)
            return closestDoorsHorizontally[0];
        var doorVerticalDistances = allDoors.map(function (a) { return Math.abs(a.originalY - _this.originalY); });
        if (Version.DoesCurrentLevelUseOldDoorPairing()) {
            doorVerticalDistances.sort();
        }
        else {
            doorVerticalDistances.sort(function (a, b) { return a - b; });
        }
        var minVerticalDistance = doorVerticalDistances[0];
        // grab all doors that are tied for closest vertically AND horizontally
        var closestDoors = closestDoorsHorizontally.filter(function (a) { return Math.abs(a.originalY - _this.originalY) == minVerticalDistance; });
        if (closestDoors.length == 1)
            return closestDoors[0];
        closestDoors.sort(function (a, b) { return (a.originalX - b.originalX) * 100000 + (a.originalY - b.originalY); });
        return closestDoors[0];
    };
    Door.prototype.Update = function () {
        if (this.originalX == -1) {
            this.originalX = this.x;
            this.originalY = this.y;
        }
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
var ScaredyDoor = /** @class */ (function (_super) {
    __extends(ScaredyDoor, _super);
    function ScaredyDoor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.originalX = -1;
        _this.originalY = -1;
        _this.zIndex = -1;
        _this.checksSinceEnemiesNear = 0;
        return _this;
    }
    ScaredyDoor.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.originalX == -1) {
            this.originalX = this.x;
            this.originalY = this.y;
        }
        if (this.age % 10 == 0) {
            // only check every so often
            // are enemies around?
            var enemiesNear = this.layer.sprites.some(function (a) { return a instanceof Enemy && a.IsOnScreen(); });
            if (enemiesNear) {
                this.checksSinceEnemiesNear = 0;
            }
            else {
                this.checksSinceEnemiesNear++;
            }
            if (player && this.checksSinceEnemiesNear > 18) {
                if (Math.abs(player.xMid - this.xMid) + Math.abs(player.yMid - this.yMid) < 24 || this.checksSinceEnemiesNear > 24) {
                    var door = (this.ReplaceWithSpriteType(Door));
                    door.originalX = this.originalX;
                    door.originalY = this.originalY;
                }
            }
        }
    };
    ScaredyDoor.prototype.GetFrameData = function (frameNum) {
        var frame = 0;
        if (this.checksSinceEnemiesNear > 6) {
            frame = 1;
        }
        if (this.checksSinceEnemiesNear > 12) {
            frame = 2;
        }
        if (this.checksSinceEnemiesNear > 18) {
            frame = 3;
        }
        return {
            imageTile: tiles["door"][frame][2],
            xFlip: frameNum % 60 < 30,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ScaredyDoor;
}(Sprite));

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
var Sparky = /** @class */ (function (_super) {
    __extends(Sparky, _super);
    function Sparky() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 6;
        _this.respectsSolidTiles = false;
        _this.dir = Direction.Right;
        _this.anchor = null;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.timer = 0;
        _this.pathingType = null;
        return _this;
    }
    Sparky.prototype.Update = function () {
        if (!this.WaitForOnScreen()) {
            return;
        }
        if (this.pathingType == null) {
            var currentTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor();
            if (currentTile && currentTile.tileType !== TileType.Air) {
                if (currentTile.tileType.trackDirections.length > 0) {
                    this.pathingType = "track";
                }
                else if (currentTile.tileType.canBePowered) {
                    this.pathingType = "wire";
                }
            }
        }
        var speed = 0.5;
        if (this.timer % 24 === 0) {
            // check upcoming tile
            var prioritizedDirections = [this.dir.Clockwise(), this.dir, this.dir.CounterClockwise()];
            this.dir = this.dir.Opposite();
            for (var _i = 0, prioritizedDirections_1 = prioritizedDirections; _i < prioritizedDirections_1.length; _i++) {
                var dir = prioritizedDirections_1[_i];
                var targetX = Math.floor(this.xMid / 12) + dir.x;
                var targetY = Math.floor(this.yMid / 12) + dir.y;
                var tile = this.layer.GetTileByIndex(targetX, targetY).GetWireNeighbor();
                if (tile && tile.tileType != TileType.Air) {
                    if (this.pathingType == "wire" && tile.tileType.canBePowered) {
                        this.dir = dir;
                        break;
                    }
                    if (this.pathingType == "track" && tile.tileType.trackDirections.length > 0) {
                        if (tile.tileType.trackDirections.indexOf(dir.Opposite()) > -1) {
                            this.dir = dir;
                            break;
                        }
                    }
                }
            }
        }
        this.timer++;
        this.dx = speed * this.dir.x;
        this.dy = speed * this.dir.y;
    };
    Sparky.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 4) % 4;
        return {
            imageTile: tiles["sparky"][frame][0],
            xFlip: frameNum % 2 == 0,
            yFlip: frameNum % 4 <= 2,
            xOffset: 3,
            yOffset: 3
        };
    };
    return Sparky;
}(Enemy));

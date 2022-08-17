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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Key = /** @class */ (function (_super) {
    __extends(Key, _super);
    function Key() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.poofTimer = -1;
        return _this;
    }
    Key.prototype.Update = function () {
        if (this.poofTimer >= 0) {
            this.poofTimer++;
            if (this.poofTimer >= 20)
                this.isActive = false;
        }
        else {
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
            // check if touching any locks
            // 8 points
            //     #          #
            //     #X        X#
            //#####################
            //    X#          #X
            //     #          #
            //     #          #
            //     #          #
            //    X#          #X
            //#####################
            //     #X        X#
            //     #          #
            var tilesToCheck = __spreadArrays(this.GetTilesByCoords([this.x, this.xRight - 0.1], [this.y - 0.1, this.yBottom]), this.GetTilesByCoords([this.x - 0.1, this.xRight], [this.y, this.yBottom - 0.1]));
            var lockTiles = [];
            for (var _i = 0, tilesToCheck_1 = tilesToCheck; _i < tilesToCheck_1.length; _i++) {
                var tileToCheck = tilesToCheck_1[_i];
                if (tileToCheck.tileType == TileType.Lock) {
                    lockTiles.push(tileToCheck);
                }
            }
            if (lockTiles.length > 0) {
                for (var _a = 0, lockTiles_1 = lockTiles; _a < lockTiles_1.length; _a++) {
                    var lockTile = lockTiles_1[_a];
                    this.layer.SetTile(lockTile.tileX, lockTile.tileY, TileType.Air);
                    var propogatingUnlockEffect = new KeyDomino(lockTile.tileX * this.layer.tileWidth, lockTile.tileY * this.layer.tileHeight, this.layer, []);
                    this.layer.sprites.push(propogatingUnlockEffect);
                }
                this.Disappear();
            }
        }
    };
    Key.prototype.Disappear = function () {
        this.poofTimer = 0;
    };
    Key.prototype.GetTilesByCoords = function (xCoords, yCoords) {
        var _this = this;
        var xTiles = xCoords.map(function (x) { return Math.floor(x / _this.layer.tileWidth); }).filter(Utility.OnlyUnique);
        var yTiles = yCoords.map(function (y) { return Math.floor(y / _this.layer.tileHeight); }).filter(Utility.OnlyUnique);
        var tiles = [];
        for (var _i = 0, xTiles_1 = xTiles; _i < xTiles_1.length; _i++) {
            var xTile = xTiles_1[_i];
            for (var _a = 0, yTiles_1 = yTiles; _a < yTiles_1.length; _a++) {
                var yTile = yTiles_1[_a];
                tiles.push(this.layer.GetTileByIndex(xTile, yTile));
            }
        }
        return tiles;
    };
    Key.prototype.GetFrameData = function (frameNum) {
        var frame = 0;
        if (this.poofTimer >= 0) {
            frame = Math.floor(this.poofTimer / 20 * 4);
        }
        return {
            imageTile: tiles["key"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    };
    return Key;
}(Sprite));

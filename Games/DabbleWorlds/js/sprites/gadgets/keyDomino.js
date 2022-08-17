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
var KeyDomino = /** @class */ (function (_super) {
    __extends(KeyDomino, _super);
    function KeyDomino() {
        // an effect that causes surrounding locks to break
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        _this.numFrames = 15;
        return _this;
    }
    KeyDomino.prototype.Update = function () {
        if (this.age == 1) {
            audioHandler.PlaySound("unlock", true);
        }
        if (this.age < this.numFrames)
            return;
        var tilesToCheck = __spreadArrays(this.GetTilesByCoords([this.xMid], [this.y - 0.1, this.yBottom]), this.GetTilesByCoords([this.x - 0.1, this.xRight], [this.yMid]));
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
        }
        this.isActive = false;
    };
    KeyDomino.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["lockpoof"]).length;
        var frame = Math.floor(this.age * totalFrames / this.numFrames);
        if (frame < 0)
            frame = 0;
        if (frame >= totalFrames)
            frame = totalFrames - 1;
        return {
            imageTile: tiles["lockpoof"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return KeyDomino;
}(Key));

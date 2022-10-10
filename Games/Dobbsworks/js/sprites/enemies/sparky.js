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
        _this.timer = 0;
        return _this;
    }
    Sparky.prototype.Update = function () {
        if (!this.WaitForOnScreen()) {
            return;
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
                if ((tile === null || tile === void 0 ? void 0 : tile.tileType) != TileType.Air) {
                    this.dir = dir;
                    break;
                }
            }
        }
        this.timer++;
        // let targetX = +((this.x + this.dir.x * speed).toFixed(3));
        // let targetY = +((this.y + this.dir.y * speed).toFixed(3));
        // let currentTileX = Math.floor((this.x + this.width/2 + this.dir.x * 3) / 12);
        // let currentTileY = Math.floor((this.y + this.height/2 + this.dir.x * 3) / 12);
        // let targetTileX = Math.floor((targetX + this.width/2 + this.dir.x * 3) / 12);
        // let targetTileY = Math.floor((targetY + this.height/2 + this.dir.y * 3) / 12);
        // let targetTile = this.layer.GetTileByIndex(targetTileX, targetTileY).GetWireNeighbor();
        // let hitEndOfLine = false;
        // let changingTile = currentTileX != targetTileX || currentTileY != targetTileY;
        // console.log(currentTileX, targetTileX )
        // if (changingTile && targetTile?.tileType == TileType.Air) {
        //     hitEndOfLine = true;
        // }
        // if (hitEndOfLine) {
        //     this.dir = this.dir.Clockwise();
        //     hitEndOfLine = true;
        //     this.dx = currentTileX * 12 + 3 - this.x;
        //     this.dy = currentTileY * 12 + 3 - this.y;
        // } else {
        this.dx = speed * this.dir.x;
        this.dy = speed * this.dir.y;
        //}
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

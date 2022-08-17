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
var Fan = /** @class */ (function (_super) {
    __extends(Fan, _super);
    function Fan() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 5;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.isPlatform = true;
        _this.isSolidBox = true;
        //public direction: Direction = Direction.Up;
        _this.gusts = [];
        return _this;
    }
    Fan.prototype.Update = function () {
        var _this = this;
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        var targetX = this.x;
        for (var i = 0; i < 5; i++) {
            var targetY = this.y - 12 * (i + 1);
            if (this.gusts[i]) {
                this.gusts[i].x = targetX;
                this.gusts[i].y = targetY;
            }
            else {
                var newGust = new Gust(targetX, targetY, this.layer, []);
                this.gusts.push(newGust);
                this.layer.sprites.push(newGust);
            }
        }
        var totalGustHeight = this.gusts.length * 12;
        var affectedSprites = this.layer.sprites.filter(function (a) { return a.xMid > _this.x && a.xMid < _this.xRight && a.yBottom <= _this.y && a.yBottom > _this.y - 60; });
        affectedSprites.forEach(function (a) { return a.gustUpTimer = 3; });
    };
    Fan.prototype.GetIsPowered = function () {
        var _a;
        var tile = (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByPixel(this.xMid, this.yBottom + 1);
        return (tile === null || tile === void 0 ? void 0 : tile.isPowered()) || false;
    };
    Fan.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][0][3],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 7
        };
    };
    return Fan;
}(Sprite));

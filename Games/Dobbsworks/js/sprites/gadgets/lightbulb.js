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
var Lightbulb = /** @class */ (function (_super) {
    __extends(Lightbulb, _super);
    function Lightbulb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        return _this;
    }
    Lightbulb.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (this.GetIsPowered() && this.age % 90 == 0) {
            var shimmerRipple = new ShimmerRipple(this.xMid, this.yMid, this.layer, []);
            shimmerRipple.maxRadiusPixels = 160;
            this.layer.sprites.push(shimmerRipple);
        }
    };
    Lightbulb.prototype.GetIsPowered = function () {
        var _a;
        var tile = (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByPixel(this.xMid, this.yBottom + 1);
        return (tile === null || tile === void 0 ? void 0 : tile.isPowered()) || false;
    };
    Lightbulb.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][this.GetIsPowered() ? 1 : 0][2],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return Lightbulb;
}(Sprite));

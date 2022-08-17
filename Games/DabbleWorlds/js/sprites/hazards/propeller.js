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
var Propeller = /** @class */ (function (_super) {
    __extends(Propeller, _super);
    function Propeller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 56;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.anchor = null;
        _this.speed = -1;
        _this.frame = 0;
        return _this;
    }
    Propeller.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isPowered = this.GetIsPowered();
        if (this.speed == -1) {
            this.speed = isPowered ? 100 : 0;
        }
        if (isPowered) {
            this.speed += 1;
        }
        else {
            this.speed -= 1;
        }
        if (this.speed > 100)
            this.speed = 100;
        if (this.speed < 0)
            this.speed = 0;
        this.frame += this.speed / 100;
    };
    Propeller.prototype.IsHazardActive = function () {
        return this.speed > 0;
    };
    Propeller.prototype.GetIsPowered = function () {
        var _a, _b;
        var tile1 = (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByPixel(this.x - 2, this.yMid);
        var tile2 = (_b = this.layer.map) === null || _b === void 0 ? void 0 : _b.wireLayer.GetTileByPixel(this.xRight + 2, this.yMid);
        return (tile1 === null || tile1 === void 0 ? void 0 : tile1.isPowered()) || (tile2 === null || tile2 === void 0 ? void 0 : tile2.isPowered()) || false;
    };
    Propeller.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.frame) % 4;
        return {
            imageTile: tiles["propeller"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    };
    return Propeller;
}(Hazard));

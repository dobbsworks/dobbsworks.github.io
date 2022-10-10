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
var CeilingButton = /** @class */ (function (_super) {
    __extends(CeilingButton, _super);
    function CeilingButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.isPowerSource = true;
        _this.isPlatform = true;
        _this.isSolidBox = true;
        _this.anchor = Direction.Up;
        _this.onTimer = 0;
        return _this;
    }
    CeilingButton.prototype.Update = function () {
        var _this = this;
        var spritesAtBottom = this.layer.sprites.filter(function (a) {
            return (a.y == _this.yBottom && a.x < _this.xRight && a.xRight > _this.x);
        });
        if (spritesAtBottom.length > 0) {
            if (this.onTimer != 30)
                audioHandler.PlaySound("erase", true);
            this.onTimer = 30;
        }
        else {
            if (this.onTimer > 0)
                this.onTimer--;
        }
    };
    CeilingButton.prototype.GetPowerPoints = function () {
        if (this.onTimer > 0) {
            return [
                { xPixel: this.xMid, yPixel: this.y - 1 }
            ];
        }
        else
            return [];
    };
    CeilingButton.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 4 : 3][1],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return CeilingButton;
}(Sprite));

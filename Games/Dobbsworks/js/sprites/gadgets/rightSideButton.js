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
var RightSideButton = /** @class */ (function (_super) {
    __extends(RightSideButton, _super);
    function RightSideButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 4;
        _this.respectsSolidTiles = true;
        _this.isPowerSource = true;
        _this.isPlatform = true;
        _this.isSolidBox = true;
        _this.anchor = Direction.Right;
        _this.onTimer = 0;
        return _this;
    }
    RightSideButton.prototype.Update = function () {
        var _this = this;
        var spritesAtLeft = this.layer.sprites.filter(function (a) {
            return (a.xRight == _this.x && a.y < _this.yBottom && a.yBottom > _this.y);
        });
        if (spritesAtLeft.length > 0) {
            if (this.onTimer != 30)
                audioHandler.PlaySound("erase", true);
            this.onTimer = 30;
        }
        else {
            if (this.onTimer > 0)
                this.onTimer--;
        }
    };
    RightSideButton.prototype.GetPowerPoints = function () {
        if (this.onTimer > 0) {
            return [
                { xPixel: this.xRight + 1, yPixel: this.yMid }
            ];
        }
        else
            return [];
    };
    RightSideButton.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 2 : 1][3],
            xFlip: false,
            yFlip: false,
            xOffset: 8,
            yOffset: 2
        };
    };
    return RightSideButton;
}(Sprite));

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
var FloorButton = /** @class */ (function (_super) {
    __extends(FloorButton, _super);
    function FloorButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.isPowerSource = true;
        _this.isPlatform = true;
        _this.isSolidBox = true;
        _this.anchor = Direction.Down;
        _this.onTimer = 0;
        return _this;
    }
    Object.defineProperty(FloorButton, "clockwiseRotationSprite", {
        get: function () { return LeftSideButton; },
        enumerable: false,
        configurable: true
    });
    FloorButton.prototype.Update = function () {
        var _this = this;
        var spritesOnTop = this.layer.sprites.filter(function (a) { return a.parentSprite == _this; });
        if (spritesOnTop.length > 0) {
            if (this.onTimer != 30 && this.IsOnScreen())
                audioHandler.PlaySound("erase", true);
            this.onTimer = 30;
        }
        else {
            if (this.onTimer > 0)
                this.onTimer--;
        }
        this.dx *= 0.9;
        this.dy *= 0.9;
    };
    FloorButton.prototype.GetPowerPoints = function () {
        if (this.onTimer > 0) {
            return [
                { xPixel: this.xMid, yPixel: this.yBottom + 1 }
            ];
        }
        else
            return [];
    };
    FloorButton.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 4 : 3][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 8
        };
    };
    return FloorButton;
}(Sprite));

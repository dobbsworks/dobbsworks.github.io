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
var LeftSideButton = /** @class */ (function (_super) {
    __extends(LeftSideButton, _super);
    function LeftSideButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 4;
        _this.respectsSolidTiles = true;
        _this.isPowerSource = true;
        _this.isPlatform = true;
        _this.isSolidBox = true;
        _this.anchor = Direction.Left;
        _this.onTimer = 0;
        return _this;
    }
    Object.defineProperty(LeftSideButton, "clockwiseRotationSprite", {
        get: function () { return CeilingButton; },
        enumerable: false,
        configurable: true
    });
    LeftSideButton.prototype.Update = function () {
        var _this = this;
        var spritesAtRight = this.layer.sprites.filter(function (a) {
            return a.touchedLeftWalls.indexOf(_this) > -1 ||
                (a.x == _this.xRight && a.y < _this.yBottom && a.yBottom > _this.y);
        });
        if (spritesAtRight.length > 0) {
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
    LeftSideButton.prototype.GetPowerPoints = function () {
        if (this.onTimer > 0) {
            return [
                { xPixel: this.x - 1, yPixel: this.yMid }
            ];
        }
        else
            return [];
    };
    LeftSideButton.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 4 : 3][3],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    };
    return LeftSideButton;
}(Sprite));

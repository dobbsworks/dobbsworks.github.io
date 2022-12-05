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
var ShakyPlatform = /** @class */ (function (_super) {
    __extends(ShakyPlatform, _super);
    function ShakyPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 0;
        _this.shakeCounter = 0;
        _this.isFalling = false;
        return _this;
    }
    ShakyPlatform.prototype.Update = function () {
        var _this = this;
        this.dx *= 0.95;
        if (this.isFalling) {
            this.ApplyGravity();
            this.MoveByVelocity();
        }
        else {
            if (this.IsPlayerStandingOn() || this.shakeCounter > 0) {
                this.shakeCounter++;
            }
            if (this.shakeCounter > 0) {
                this.xRenderOffset = Math.sin(this.age / 3);
                if (this.shakeCounter >= 20) {
                    this.xRenderOffset = 0;
                    this.isFalling = true;
                    var motors = this.layer.sprites.filter(function (a) { return a instanceof Motor && a.connectedSprite == _this; });
                    motors.forEach(function (a) { return a.connectedSprite = null; });
                }
            }
        }
    };
    return ShakyPlatform;
}(BasePlatform));

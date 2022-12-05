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
var Splatform = /** @class */ (function (_super) {
    __extends(Splatform, _super);
    function Splatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 1;
        _this.sourceImage = "platform2";
        _this.isStarted = false;
        _this.isInitialized = false;
        _this.motor = null;
        return _this;
    }
    Splatform.prototype.Update = function () {
        var _this = this;
        if (!this.isInitialized) {
            this.isInitialized = true;
            var motor = this.layer.sprites.find(function (a) { return a instanceof Motor && a.connectedSprite == _this; });
            if (motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
            this.targetY = this.y;
        }
        if (!this.motor) {
            this.dy = 0;
            var remainingDistance = this.targetY - this.y;
            if (remainingDistance < 0.2) {
                this.dy = remainingDistance;
            }
            else {
                this.dy = remainingDistance / 10;
            }
        }
        if (this.motor && player && player.parentSprite == this) {
            // player on this platform
            var remainingSpeed = this.motor.motorSpeedRatio;
            if (remainingSpeed < 0.02) {
                this.motor.motorSpeedRatio = 0;
            }
            else {
                this.motor.motorSpeedRatio = remainingSpeed * 0.98;
            }
        }
        this.MoveByVelocity();
    };
    Splatform.prototype.PlayerAttemptJump = function () {
        if (this.motor) {
            if (player && player.parentSprite == this) {
                // player on this platform
                this.motor.motorSpeedRatio = 1;
            }
        }
        else {
            if (this.targetY == this.y) {
                this.targetY += 12;
            }
        }
    };
    return Splatform;
}(BasePlatform));

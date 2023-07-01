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
var RisingPlatform = /** @class */ (function (_super) {
    __extends(RisingPlatform, _super);
    function RisingPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 6;
        _this.isStarted = false;
        _this.isInitialized = false;
        _this.motor = null;
        return _this;
    }
    RisingPlatform.prototype.Update = function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            var motor = this.GetParentMotor();
            if (motor instanceof Motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
        }
        if (this.isStarted) {
            this.dy -= 0.04;
            if (this.dy < -1)
                this.dy = -1;
            if (this.motor && this.motor.motorSpeedRatio < 1) {
                this.motor.motorSpeedRatio += 0.05;
                if (this.motor.motorSpeedRatio > 1)
                    this.motor.motorSpeedRatio = 1;
            }
        }
        if (!this.isStarted && this.IsPlayerStandingOn()) {
            this.isStarted = true;
            this.dy = 1.2;
        }
        this.dx *= 0.95;
        this.MoveByVelocity();
        if (this.y < (this.layer.tiles[0][0].tileY * this.layer.tileHeight) - 12) {
            this.isActive = false;
        }
    };
    return RisingPlatform;
}(BasePlatform));

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
var WeightedPlatform = /** @class */ (function (_super) {
    __extends(WeightedPlatform, _super);
    function WeightedPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 1;
        _this.weightThreshold = -1;
        _this.originalY = -9999;
        _this.speed = 0.2;
        _this.isInitialized = false;
        _this.motor = null;
        return _this;
    }
    WeightedPlatform.prototype.Update = function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            var motor = this.GetParentMotor();
            if (motor instanceof Motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
            this.weightThreshold = Math.max(1, Math.floor(this.width / 24));
        }
        if (this.motor == null) {
            this.MoveByVelocity();
            if (this.originalY == -9999)
                this.originalY = this.y;
            var numberOfFullRiders = this.GetFullRiderCount();
            var partialRiderCount = this.GetOneFootRiderCount();
            var hasPartialRider = partialRiderCount > 0;
            if (numberOfFullRiders >= this.weightThreshold) {
                this.tilesetRow = 4;
                this.dy = this.speed;
            }
            else {
                if (this.y == this.originalY) {
                    this.tilesetRow = 1;
                    this.dy = 0;
                    if (numberOfFullRiders > 0 || hasPartialRider) {
                        this.tilesetRow = 3;
                    }
                }
                else {
                    this.tilesetRow = 2;
                    this.dy = -this.speed;
                    if (numberOfFullRiders + partialRiderCount >= this.weightThreshold) {
                        this.tilesetRow = 3;
                        this.dy = 0;
                    }
                }
            }
            if (this.y < this.originalY) {
                this.y = this.originalY;
            }
        }
        else {
            var targetSpeed = 0;
            var numberOfFullRiders = this.GetFullRiderCount();
            if (numberOfFullRiders > 0 && this.tilesetRow == 1) {
                // initial touch
                this.tilesetRow = 2;
                targetSpeed = 1;
            }
            if (this.tilesetRow != 1) {
                if (numberOfFullRiders < this.weightThreshold) {
                    this.tilesetRow = 2;
                    targetSpeed = 1;
                }
                if (numberOfFullRiders == this.weightThreshold) {
                    this.tilesetRow = 3;
                    targetSpeed = 0;
                }
                if (numberOfFullRiders > this.weightThreshold) {
                    this.tilesetRow = 4;
                    targetSpeed = -0.5;
                }
                // approach motor speed
                if (this.motor.motorSpeedRatio < targetSpeed) {
                    this.motor.motorSpeedRatio += 0.02;
                }
                if (this.motor.motorSpeedRatio > targetSpeed) {
                    this.motor.motorSpeedRatio -= 0.02;
                }
                if (this.motor.motorSpeedRatio > 1)
                    this.motor.motorSpeedRatio = 1;
                if (this.motor.motorSpeedRatio < -0.5)
                    this.motor.motorSpeedRatio = -0.5;
                if (targetSpeed == 0 && Math.abs(this.motor.motorSpeedRatio) < 0.02)
                    this.motor.motorSpeedRatio = 0;
            }
        }
    };
    return WeightedPlatform;
}(BasePlatform));

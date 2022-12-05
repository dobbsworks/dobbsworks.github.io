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
var CloudPlatform = /** @class */ (function (_super) {
    __extends(CloudPlatform, _super);
    function CloudPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 7;
        _this.isFalling = false;
        return _this;
    }
    CloudPlatform.prototype.Update = function () {
        if (this.isFalling) {
            var targetFallSpeed = 0.3;
            var fallAccel = 0.05;
            if (Math.abs(this.dy - targetFallSpeed) < fallAccel) {
                this.dy = targetFallSpeed;
            }
            else {
                if (this.dy > targetFallSpeed)
                    this.dy -= Math.abs(fallAccel);
                else
                    this.dy += Math.abs(fallAccel);
            }
            this.dx *= 0.95;
            this.MoveByVelocity();
        }
        else {
            if (this.IsPlayerStandingOn()) {
                this.isFalling = true;
            }
        }
    };
    return CloudPlatform;
}(BasePlatform));

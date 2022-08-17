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
var Battery = /** @class */ (function (_super) {
    __extends(Battery, _super);
    function Battery() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 6;
        _this.respectsSolidTiles = true;
        _this.rolls = false;
        _this.canBeHeld = true;
        _this.isPowerSource = true;
        return _this;
    }
    Battery.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Battery.prototype.GetPowerPoints = function () {
        return [
            { xPixel: this.xMid, yPixel: this.y - 1 },
            { xPixel: this.xMid, yPixel: this.yBottom + 1 }
        ];
    };
    Battery.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    };
    return Battery;
}(Sprite));

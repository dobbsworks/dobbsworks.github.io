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
var FloatingPlatform = /** @class */ (function (_super) {
    __extends(FloatingPlatform, _super);
    function FloatingPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 5;
        _this.floatsInWater = true;
        _this.floatingPointOffset = 3;
        _this.waterMinDy = 0.3;
        _this.riderCount = 0;
        return _this;
    }
    FloatingPlatform.prototype.Update = function () {
        var _a, _b;
        this.ApplyGravity();
        var oldRiderCount = this.riderCount;
        var riders = this.GetFullRiders();
        this.riderCount = riders.length;
        var isRidersChanges = oldRiderCount != this.riderCount;
        if (isRidersChanges) {
            if ((((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.waterLevel.currentY) || 0) > this.yBottom && (((_b = this.layer.map) === null || _b === void 0 ? void 0 : _b.purpleWaterLevel.currentY) || 0) > this.yBottom)
                this.dy = 0.3;
        }
        this.dx *= 0.95;
        this.ReactToWater();
        this.MoveByVelocity();
    };
    return FloatingPlatform;
}(BasePlatform));

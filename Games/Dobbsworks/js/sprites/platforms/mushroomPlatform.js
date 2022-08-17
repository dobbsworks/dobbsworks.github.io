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
var MushroomPlatform = /** @class */ (function (_super) {
    __extends(MushroomPlatform, _super);
    function MushroomPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 0;
        _this.shakeCounter = 0;
        _this.isFalling = false;
        _this.sourceImage = "platform2";
        _this.bouncetimer = 0;
        return _this;
    }
    MushroomPlatform.prototype.Update = function () {
        var riders = this.GetFullRiders();
        for (var _i = 0, riders_1 = riders; _i < riders_1.length; _i++) {
            var rider = riders_1[_i];
            rider.dy = -3.8;
            if (rider instanceof Player) {
                rider.forcedJumpTimer = 28;
            }
            rider.parentSprite = null;
            this.bouncetimer = 30;
            audioHandler.PlaySound("boing", true);
        }
        if (this.bouncetimer > 0) {
            this.bouncetimer--;
            this.yRenderOffset = Math.sin(this.bouncetimer) / (31 - this.bouncetimer) * 4;
        }
    };
    return MushroomPlatform;
}(BasePlatform));

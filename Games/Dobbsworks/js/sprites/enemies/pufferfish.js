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
var Pufferfish = /** @class */ (function (_super) {
    __extends(Pufferfish, _super);
    function Pufferfish() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.verticalDirection = 1;
        return _this;
    }
    Pufferfish.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        if (this.isOnGround)
            this.verticalDirection = -1;
        if (this.isOnCeiling)
            this.verticalDirection = 1;
        if (!this.isInWater)
            this.verticalDirection = 1;
        this.dy = this.verticalDirection * 0.125;
    };
    Pufferfish.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.age / 20) % 2;
        return {
            imageTile: tiles["pufferfish"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return Pufferfish;
}(Enemy));

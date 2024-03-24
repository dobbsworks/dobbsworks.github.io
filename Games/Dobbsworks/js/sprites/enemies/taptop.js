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
var Taptop = /** @class */ (function (_super) {
    __extends(Taptop, _super);
    function Taptop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 14;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        return _this;
    }
    Taptop.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.GroundPatrol(0.4, true);
        this.ApplyGravity();
        this.ApplyInertia();
    };
    Taptop.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Taptop.prototype.OnBounce = function () {
        var barrel = this.ReplaceWithSpriteType(Barrel);
        barrel.dx = 0;
        barrel.dy = 0;
    };
    Taptop.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 60 * 4) % 4;
        return {
            imageTile: tiles["taptop"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return Taptop;
}(Enemy));

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
var Prickle = /** @class */ (function (_super) {
    __extends(Prickle, _super);
    function Prickle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        return _this;
    }
    Prickle.prototype.Update = function () {
        if (!this.WaitForOnScreen()) {
            this.dx = -0.3;
            return;
        }
        this.GroundPatrol(0.3, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    };
    Prickle.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1];
        var frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    };
    return Prickle;
}(Enemy));

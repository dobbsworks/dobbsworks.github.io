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
var Biggle = /** @class */ (function (_super) {
    __extends(Biggle, _super);
    function Biggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 22;
        _this.width = 24;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.squishTimer = 0;
        _this.animationSpeed = 0.2;
        _this.frameRow = 0;
        _this.turnAtLedges = true;
        _this.bounceSoundId = "oink";
        return _this;
    }
    Biggle.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.GroundPatrol(0.3, this.turnAtLedges);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    };
    Biggle.prototype.OnBounce = function () {
        var _this = this;
        this.isActive = false;
        [1, -1].forEach(function (dir) {
            var pig = new Piggle(_this.xMid + dir * 6 - 5.5, _this.yMid, _this.layer, []);
            _this.layer.sprites.push(pig);
            pig.dx = dir * 0.5;
            pig.dy = -1;
            pig.direction = dir == -1 ? -1 : 1;
        });
    };
    Biggle.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 1, 0, 3, 4, 4, 3];
        var frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        //if (this.isInDeathAnimation) frame = 5;
        return {
            imageTile: tiles["bigpig"][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 4,
            yOffset: 6
        };
    };
    return Biggle;
}(Enemy));

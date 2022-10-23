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
var SnowtemPole = /** @class */ (function (_super) {
    __extends(SnowtemPole, _super);
    function SnowtemPole() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.numLowerParts = 5;
        _this.height = _this.numLowerParts * 6 + 9;
        _this.width = 9;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        return _this;
    }
    SnowtemPole.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.height = this.numLowerParts * 6 + 9;
        this.GroundPatrol(0.3, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    };
    SnowtemPole.prototype.OnBounce = function () {
        if (this.numLowerParts > 0) {
            this.numLowerParts--;
            this.height -= 6;
            this.y += 6;
        }
        else {
            this.isActive = false;
        }
        var deadBody = new SnowmanWormBody(this.x, this.yBottom - 6, this.layer, []);
        var spr = new DeadEnemy(deadBody);
        this.layer.sprites.push(spr);
    };
    SnowtemPole.prototype.GetFrameData = function (frameNum) {
        var frames = [{
                imageTile: tiles["snowman"][1][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: (this.direction == 1 ? 3 : 0) + Math.sin(this.age / 10 - 1 / 2),
                yOffset: 0
            }];
        for (var i = 0; i < this.numLowerParts; i++) {
            frames.unshift({
                imageTile: tiles["snowman"][0][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: (this.direction == 1 ? 3 : 0) + Math.sin(this.age / 10 + i / 2),
                yOffset: -(i + 1) * 6
            });
        }
        return frames;
    };
    return SnowtemPole;
}(Enemy));

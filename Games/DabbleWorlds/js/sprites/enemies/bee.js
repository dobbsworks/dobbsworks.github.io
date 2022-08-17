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
var BeeWithSunglasses = /** @class */ (function (_super) {
    __extends(BeeWithSunglasses, _super);
    function BeeWithSunglasses() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 7;
        _this.width = 9;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.patrolTimer = 0;
        return _this;
    }
    BeeWithSunglasses.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isTouchingLeftWall) {
            this.direction = 1;
            this.patrolTimer = 0;
            this.dx = 0;
        }
        if (this.isTouchingRightWall) {
            this.direction = -1;
            this.patrolTimer = 0;
            this.dx = 0;
        }
        this.patrolTimer++;
        if (this.patrolTimer > 200) {
            this.patrolTimer = 0;
            this.direction *= -1;
        }
        this.dx += 0.03 * this.direction;
        this.dy += Math.cos(this.age / 30) / 1000;
        if (Math.abs(this.dx) > 0.3) {
            this.dx = this.direction * 0.3;
        }
        this.ApplyInertia();
        this.ReactToWater();
    };
    BeeWithSunglasses.prototype.OnBounce = function () {
        this.ReplaceWithSprite(new DeadEnemy(this));
    };
    BeeWithSunglasses.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 5) % 2;
        return {
            imageTile: tiles["bee"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 3
        };
    };
    return BeeWithSunglasses;
}(Enemy));

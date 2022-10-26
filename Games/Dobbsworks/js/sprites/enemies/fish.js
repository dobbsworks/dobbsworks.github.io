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
var AFish = /** @class */ (function (_super) {
    __extends(AFish, _super);
    function AFish() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.lastX = 0;
        return _this;
    }
    AFish.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        var wasInWater = this.isInWater;
        this.ReactToWater();
        if (wasInWater && !this.isInWater) {
            this.x = this.lastX;
            this.direction *= -1;
            this.ReactToWater();
        }
        this.lastX = this.x;
        if (this.isInWater) {
            this.ApplyInertia();
            if (Math.abs(this.dy) > 0.035)
                this.dy *= 0.9;
            if (this.direction == 1 && this.isTouchingRightWall) {
                this.direction = -1;
            }
            if (this.direction == -1 && this.isTouchingLeftWall) {
                this.direction = 1;
            }
            var targetDx = this.direction * 0.3;
            if (this.direction == 1 && this.dx < 0)
                this.dx = 0;
            if (this.direction == -1 && this.dx > 0)
                this.dx = 0;
            if (this.dx != targetDx) {
                this.dx += (targetDx - this.dx) * 0.1;
            }
            this.dy += Math.cos(this.age / 30) / 1000;
        }
        else {
            this.ApplyGravity();
            this.ReplaceWithSpriteType(FloppingFish);
        }
        this.canBeBouncedOn = (player && !player.isInWater);
    };
    AFish.prototype.OnBounce = function () {
        this.ReplaceWithSprite(new DeadEnemy(this));
        this.OnDead();
    };
    AFish.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return AFish;
}(Enemy));
var FloppingFish = /** @class */ (function (_super) {
    __extends(FloppingFish, _super);
    function FloppingFish() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.direction = 1;
        return _this;
    }
    FloppingFish.prototype.Update = function () {
        this.ApplyGravity();
        this.ReactToPlatformsAndSolids();
        this.ReactToWater();
        this.ApplyInertia();
        this.MoveByVelocity();
        if (this.isInWater) {
            this.ReplaceWithSpriteType(AFish);
        }
        if (this.standingOn.length) {
            this.dy = -1;
            this.direction *= -1;
            this.dx = this.direction * 0.5;
        }
        if (player && this.IsGoingToOverlapSprite(player)) {
            var dead = this.ReplaceWithSprite(new DeadEnemy(this));
            dead.dy = -1;
            dead.dx = 0.5;
            this.OnDead();
        }
    };
    FloppingFish.prototype.GetFrameData = function (frameNum) {
        var col = 2;
        var yFlip = Math.floor(frameNum / 10) % 2 == 0;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: false,
            yFlip: yFlip,
            xOffset: 2,
            yOffset: 6
        };
    };
    return FloppingFish;
}(Sprite));

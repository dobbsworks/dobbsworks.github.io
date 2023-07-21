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
var BowlingBall = /** @class */ (function (_super) {
    __extends(BowlingBall, _super);
    function BowlingBall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = true;
        _this.isHeavy = true;
        _this.floatsInWater = false;
        _this.hurtsEnemies = false;
        return _this;
    }
    BowlingBall.prototype.OnStrikeEnemy = function (enemy) {
        this.dx *= 0.8;
        audioHandler.PlaySound("pins", true);
    };
    BowlingBall.prototype.OnThrow = function (thrower, direction) {
        if (thrower instanceof Player) {
            this.dx = direction * 0.5 + thrower.GetTotalDx();
            this.dy = 0;
            thrower.dx += -1;
        }
    };
    BowlingBall.prototype.OnUpThrow = function (thrower, direction) {
        if (thrower instanceof Player) {
            this.dx = (direction * 1) * 0 + thrower.GetTotalDx();
            this.dy = -1;
        }
    };
    BowlingBall.prototype.OnDownThrow = function (thrower, direction) {
        if (thrower instanceof Player) {
            this.dx = (direction * 1) / 4 + thrower.GetTotalDx();
            this.dy = 2;
            thrower.dy -= 2;
        }
    };
    BowlingBall.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        }
        else {
            this.rotation -= this.GetTotalDx() / 2;
        }
        this.ReactToPlatformsAndSolids();
        this.ReactToVerticalWind();
        this.MoveByVelocity();
        this.hurtsEnemies = this.GetTotalDx() > 0.2;
        if (this.GetTotalDx() < 0.2) {
            this.rolls = false;
            this.ApplyInertia();
            this.rolls = true;
        }
    };
    BowlingBall.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["bowlingball"]).length;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = (Math.floor(rot / (Math.PI * 2) * totalFrames) || 0);
        if (frame < 0)
            frame = 0;
        return {
            imageTile: tiles["bowlingball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return BowlingBall;
}(Sprite));

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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 4;
        _this.respectsSolidTiles = false;
        _this.rolls = true;
        _this.canBeHeld = false;
        _this.targetDx = 0;
        _this.targetDy = 0;
        _this.hurtsEnemies = true;
        return _this;
    }
    Bullet.prototype.OnStrikeEnemy = function (enemy) {
        this.isActive = false;
    };
    Bullet.prototype.Update = function () {
        if (this.isTouchingLeftWall || this.isTouchingRightWall || this.isOnGround || this.isOnCeiling) {
            this.isActive = false;
        }
        if (this.parentSprite) {
            this.isActive = false;
        }
        if (!this.IsOnScreen()) {
            this.isActive = false;
        }
        this.dx = this.targetDx;
        this.dy = this.targetDy;
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Bullet.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 10) % 4;
        return {
            imageTile: tiles["bullet"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Bullet;
}(Sprite));

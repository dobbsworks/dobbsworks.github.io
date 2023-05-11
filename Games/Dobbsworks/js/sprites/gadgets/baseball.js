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
var Baseball = /** @class */ (function (_super) {
    __extends(Baseball, _super);
    function Baseball() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = true;
        _this.isInThrowMode = false;
        _this.throwDirection = 1;
        _this.floatsInWater = true;
        _this.hurtsEnemies = false;
        return _this;
    }
    Baseball.prototype.OnStrikeEnemy = function (enemy) {
        this.isInThrowMode = false;
        this.dy -= 2;
        this.dx *= 0.5;
    };
    Baseball.prototype.OnExitPipe = function (exitDirection) {
        if (exitDirection.x == 0) {
            this.isInThrowMode = false;
        }
        else {
            if (this.isInThrowMode) {
                this.dy = 0;
                this.throwDirection = exitDirection.x == 1 ? 1 : -1;
            }
        }
    };
    Baseball.prototype.Update = function () {
        this.hurtsEnemies = this.isInThrowMode;
        if (player && player.heldItem == this)
            this.isInThrowMode = false;
        if (this.isInThrowMode) {
            this.dx = this.throwDirection * 1.5;
            if (this.isInWater)
                this.dx *= 0.5;
        }
        else {
            this.ApplyGravity();
            this.ApplyInertia();
        }
        this.ReactToWater();
        if (this.isOnGround || this.isTouchingLeftWall || this.isTouchingRightWall) {
            this.isInThrowMode = false;
        }
        if (this.parentSprite) {
            this.isInThrowMode = false;
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        }
        else {
            this.rotation -= this.GetTotalDx() / 2;
        }
        this.ReactToPlatformsAndSolids();
        this.ReactToVerticalWind();
        this.MoveByVelocity();
    };
    Baseball.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["baseball"]).length;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = Math.floor(rot / (Math.PI * 2) * totalFrames) || 1;
        if (frame < 0)
            frame = 0;
        return {
            imageTile: tiles["baseball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    Baseball.prototype.OnThrow = function (thrower, direction) {
        this.isInThrowMode = true;
        this.throwDirection = direction;
        this.dy = 0;
    };
    return Baseball;
}(Sprite));

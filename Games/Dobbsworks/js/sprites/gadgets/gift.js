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
var Gift = /** @class */ (function (_super) {
    __extends(Gift, _super);
    function Gift() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.isInThrowMode = false;
        _this.isBreaking = false;
        _this.contents = Key;
        _this.breakTimer = 0;
        _this.maxBreakTime = 20;
        return _this;
    }
    Gift.prototype.Update = function () {
        var oldDx = this.GetTotalDx();
        if (!this.isBreaking) {
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
            this.MoveByVelocity();
        }
        var newDx = this.GetTotalDx();
        var horizontalChange = Math.abs(newDx - oldDx) > 0.2;
        if (this.isInWater)
            this.isInThrowMode = false;
        if (this.isInThrowMode && (this.isOnCeiling || this.isOnGround))
            this.isBreaking = true;
        if (this.isInThrowMode && horizontalChange && (this.isTouchingLeftWall || this.isTouchingRightWall))
            this.isBreaking = true;
        if (this.isBreaking) {
            if (this.breakTimer == 0) {
                var newSprite = new this.contents(this.x, this.y, this.layer, []);
                this.layer.sprites.push(newSprite);
                newSprite.GentlyEjectFromSolids();
                this.canBeHeld = false;
            }
            this.breakTimer++;
            if (this.breakTimer >= this.maxBreakTime) {
                this.isActive = false;
            }
        }
    };
    Gift.prototype.GetFrameData = function (frameNum) {
        var frame = 0;
        if (this.breakTimer) {
            var time = Math.min(this.maxBreakTime, this.breakTimer);
            frame = Math.ceil(4 * time / this.maxBreakTime) + 1;
        }
        return {
            imageTile: tiles["gift"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    Gift.prototype.OnThrow = function (thrower, direction) {
        this.isInThrowMode = true;
        _super.prototype.OnThrow.call(this, thrower, direction);
    };
    Gift.prototype.OnUpThrow = function (thrower, direction) {
        this.isInThrowMode = true;
        _super.prototype.OnUpThrow.call(this, thrower, direction);
    };
    return Gift;
}(Sprite));

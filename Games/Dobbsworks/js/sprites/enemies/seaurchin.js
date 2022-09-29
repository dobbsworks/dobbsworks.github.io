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
var Lurchin = /** @class */ (function (_super) {
    __extends(Lurchin, _super);
    function Lurchin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 24;
        _this.width = 24;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.facing = Direction.Left;
        _this.wallPauseTimer = 0;
        return _this;
    }
    Lurchin.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        var speed = this.isInWater ? 0.4 : 0.25;
        if (!this.isInWater)
            this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        var isChangingDirection = true;
        if (this.facing == Direction.Left && this.touchedLeftWalls.length) {
            this.facing = Direction.Up;
            if (!this.isInWater)
                this.facing = Direction.Right;
        }
        else if (this.facing == Direction.Up && (this.touchedCeilings.length || !this.isInWater)) {
            this.facing = Direction.Right;
        }
        else if (this.facing == Direction.Right && this.touchedRightWalls.length) {
            this.facing = Direction.Down;
        }
        else if (this.facing == Direction.Down && this.isOnGround) {
            this.facing = Direction.Left;
        }
        else {
            isChangingDirection = false;
        }
        if (isChangingDirection) {
            this.wallPauseTimer = 20;
            this.dx = 0;
            this.dy = 0;
        }
        if (this.wallPauseTimer > 0) {
            this.wallPauseTimer--;
        }
        else {
            this.dx = this.facing.x * speed;
            this.dy = this.facing.y * speed;
        }
        if (this.facing == Direction.Left)
            this.direction = -1;
        if (this.facing == Direction.Right)
            this.direction = 1;
    };
    Lurchin.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1];
        var frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle-egg-big"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    };
    return Lurchin;
}(Enemy));

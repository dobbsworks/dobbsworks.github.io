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
var Yoyo = /** @class */ (function (_super) {
    __extends(Yoyo, _super);
    function Yoyo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 5;
        _this.width = 6;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        return _this;
    }
    Yoyo.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Yoyo.prototype.OnThrow = function (thrower, direction) { this.YoyoThrow(direction); };
    Yoyo.prototype.OnUpThrow = function (thrower, direction) { this.YoyoThrow(direction); };
    Yoyo.prototype.OnDownThrow = function (thrower, direction) { this.YoyoThrow(direction); };
    Yoyo.prototype.YoyoThrow = function (facing) {
        var horizontalDir = KeyboardHandler.IsKeyPressed(KeyAction.Left, false) ? -1 :
            KeyboardHandler.IsKeyPressed(KeyAction.Right, false) ? 1 : 0;
        var verticalDir = KeyboardHandler.IsKeyPressed(KeyAction.Up, false) ? -1 :
            KeyboardHandler.IsKeyPressed(KeyAction.Down, false) ? 1 : 0;
        if (horizontalDir == 0 && verticalDir == 0)
            horizontalDir = facing;
        var newSprite = this.ReplaceWithSpriteType(SpinningYoyo);
        var isDiagonal = horizontalDir != 0 && verticalDir != 0;
        var baseSpeed = 3;
        if (isDiagonal)
            baseSpeed /= Math.sqrt(2);
        newSprite.dx = horizontalDir * baseSpeed;
        newSprite.dy = verticalDir * baseSpeed;
    };
    Yoyo.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["yoyo"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: -1,
            yOffset: -1
        };
    };
    return Yoyo;
}(Sprite));
var SpinningYoyo = /** @class */ (function (_super) {
    __extends(SpinningYoyo, _super);
    function SpinningYoyo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 4;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        return _this;
    }
    SpinningYoyo.prototype.Update = function () {
        if (this.age <= 12) {
            if (player)
                player.yoyoTarget = this;
            this.MoveByVelocity();
        }
        else if (this.age == 32) {
            this.ReplaceWithSpriteType(Poof);
            if (player) {
                var theta = Math.atan2(this.yBottom - player.yMid, this.xMid - player.xMid);
                var speed = 3;
                player.dx = speed * Math.cos(theta);
                player.dy = speed * Math.sin(theta);
                player.yoyoTarget = null;
                player.yoyoTimer = 10;
            }
        }
    };
    SpinningYoyo.prototype.OnBeforeDraw = function (camera) {
        if (!player)
            return;
        var theta = Math.atan2(this.yBottom - player.y, this.xMid - player.xMid);
        var distance = Math.sqrt(Math.pow((this.xMid - player.xMid), 2) + Math.pow((this.yBottom - player.y), 2));
        camera.ctx.fillStyle = "#000";
        for (var r = 3; r < distance; r += 3) {
            var gameX = r * Math.cos(theta) + player.xMid;
            var gameY = r * Math.sin(theta) + player.y;
            var destX = (gameX - camera.x) * camera.scale + camera.canvas.width / 2;
            var destY = (gameY - camera.y) * camera.scale + camera.canvas.height / 2;
            camera.ctx.fillRect(destX, destY, 1 * camera.scale, 1 * camera.scale);
        }
    };
    SpinningYoyo.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(this.age / 3) % 4;
        return {
            imageTile: tiles["yoyo"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: -1,
            yOffset: -1
        };
    };
    return SpinningYoyo;
}(Sprite));

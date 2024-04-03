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
var Rideable = /** @class */ (function (_super) {
    __extends(Rideable, _super);
    function Rideable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rideable.prototype.OnTryJump = function (p) {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            return true;
        }
        if (this.isOnGround || this.parentSprite) {
            this.dy -= 2.2;
            this.parentSprite = null;
        }
        return false;
    };
    Rideable.prototype.OnRiderTakeDamage = function () {
        return true; // yes, rider takes damage
    };
    return Rideable;
}(Sprite));
var Minecart = /** @class */ (function (_super) {
    __extends(Minecart, _super);
    function Minecart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 17;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = false;
        _this.floatsInWater = false;
        _this.isPlatform = true;
        _this.zIndex = 2;
        _this.ridingYOffset = 5;
        _this.hurtsEnemies = false;
        return _this;
    }
    Minecart.prototype.Update = function () {
        if (player && player.parentSprite == this) {
            player.x = Utility.Approach(player.x, this.xMid - player.width / 2, 1);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
                this.AccelerateHorizontally(0.02, 1.5);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
                this.AccelerateHorizontally(0.02, -1.5);
        }
        this.ridingYOffset = 5;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
            this.ridingYOffset = 7;
        this.ApplyGravity();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Minecart.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["minecart"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 1
        };
    };
    return Minecart;
}(Rideable));
var Teacup = /** @class */ (function (_super) {
    __extends(Teacup, _super);
    function Teacup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 17;
        _this.respectsSolidTiles = true;
        _this.rolls = false;
        _this.canBeHeld = true;
        _this.isPlatform = true;
        _this.zIndex = 2;
        _this.ridingYOffset = 5;
        _this.floatsInWater = true;
        _this.floatsInLava = true;
        _this.groundTime = 0;
        return _this;
    }
    Teacup.prototype.OnRiderTakeDamage = function () {
        if (player && player.parentSprite == this) {
            player.parentSprite = null;
            this.ReplaceWithSpriteType(BrokenTeacup);
            // TODO shatter sound
        }
        return false;
    };
    Teacup.prototype.OnTryJump = function (p) {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            return true;
        }
        if (this.groundTime < 10) {
            this.groundTime = 11;
            this.dy = -2.2;
            this.isOnGround = false;
            this.parentSprite = null;
        }
        return false;
    };
    Teacup.prototype.Update = function () {
        if (this.isOnGround || this.parentSprite) {
            this.groundTime = 0;
        }
        else {
            this.groundTime++;
        }
        if (player && player.parentSprite == this) {
            player.x = Utility.Approach(player.x, this.xMid - player.width / 2, 1);
            var dir = 0;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
                dir = 1;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
                dir = -1;
            if (dir != 0) {
                if (this.isInWater) {
                    this.AccelerateHorizontally(0.03, dir * 1.0);
                }
                else if (this.groundTime < 10) {
                    this.AccelerateHorizontally(0.03, dir * 1.0);
                    if (this.isOnGround || this.parentSprite)
                        this.dy = -.5;
                }
                else {
                    this.AccelerateHorizontally(0.01, dir * 1.0);
                }
            }
        }
        this.ridingYOffset = 5;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
            this.ridingYOffset = 7;
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Teacup.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["minecart"][0][1],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return Teacup;
}(Rideable));
var BrokenTeacup = /** @class */ (function (_super) {
    __extends(BrokenTeacup, _super);
    function BrokenTeacup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 17;
        _this.respectsSolidTiles = false;
        return _this;
    }
    BrokenTeacup.prototype.Update = function () {
        this.ApplyGravity();
        this.MoveByVelocity();
    };
    BrokenTeacup.prototype.GetFrameData = function (frameNum) {
        if (frameNum % 10 < 5)
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        return {
            imageTile: tiles["minecart"][0][1],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return BrokenTeacup;
}(Sprite));

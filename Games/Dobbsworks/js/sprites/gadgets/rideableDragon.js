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
var Drakkie = /** @class */ (function (_super) {
    __extends(Drakkie, _super);
    function Drakkie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 18;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.canSpinBounceOn = true;
        _this.isPlatform = true;
        _this.zIndex = 2;
        _this.isInitialized = false;
        _this.flameTimer = 0;
        _this.direction = 1;
        _this.targetDx = 0;
        _this.ridingYOffset = 5;
        _this.speed = 1.2;
        _this.isGliding = false;
        _this.glideTimer = 0;
        return _this;
    }
    Drakkie.prototype.OnTryJump = function (p) {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.dy = 0;
            return true;
        }
        if (this.isOnGround || this.parentSprite) {
            this.dy -= 2.2;
            this.parentSprite = null;
        }
        else {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && this.glideTimer == 0) {
                this.isGliding = true;
                this.glideTimer = 1;
            }
        }
        return false;
    };
    Drakkie.prototype.OnRiderTakeDamage = function () {
        return true; // yes, rider takes damage
    };
    Drakkie.prototype.Update = function () {
        if (!this.WaitForOnScreen()) {
            return;
        }
        if (this.isGliding || this.glideTimer < 0)
            this.glideTimer++;
        if (this.isOnGround)
            this.isGliding = false;
        this.targetDx = 0;
        if (player && player.parentSprite == this) {
            player.x = Utility.Approach(player.x, this.xMid - player.width / 2, 1);
            if (this.isGliding) {
                this.targetDx = this.direction * this.speed * 1.5;
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
                if (this.isGliding) {
                    if (this.direction == -1) {
                        this.targetDx = -this.speed / 2;
                    }
                }
                else {
                    this.targetDx = this.speed;
                    this.direction = 1;
                }
            }
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
                if (this.isGliding) {
                    if (this.direction == 1) {
                        this.targetDx = this.speed / 2;
                    }
                }
                else {
                    this.targetDx = -this.speed;
                    this.direction = -1;
                }
            }
            else {
                this.ApplyInertia();
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true) || KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                if (this.glideTimer > 3) {
                    this.isGliding = false;
                    this.glideTimer = -2;
                }
            }
            player.direction = this.direction;
        }
        this.AccelerateHorizontally(0.05, this.targetDx);
        this.ApplyGravity();
        if (this.isGliding && this.GetTotalDy() > 0)
            this.dy *= 0.7;
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Drakkie.prototype.GetFrameData = function (frameNum) {
        var frameRow = Math.floor(frameNum / 10) % 3;
        if (this.targetDx == 0)
            frameRow = 3;
        if (!this.isOnGround)
            frameRow = 4;
        return {
            imageTile: tiles["babyDragon"][1][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 2
        };
    };
    return Drakkie;
}(Rideable));

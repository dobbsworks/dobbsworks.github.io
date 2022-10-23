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
var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 5;
        _this.width = 14;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.direction = 1;
        _this.isRocketing = false;
        _this.canHangFrom = false;
        return _this;
    }
    Rocket.prototype.Update = function () {
        if (this.isRocketing) {
            this.ReactToPlatformsAndSolids();
            this.AccelerateHorizontally(0.1, this.direction * 1.5);
            if (this.isTouchingLeftWall || this.isTouchingRightWall) {
                this.ReplaceWithSprite(new DeadEnemy(this));
                if (player && player.heldItem == this)
                    player.heldItem = null;
            }
        }
        else {
            if (player) {
                var jumpHeld = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false);
                if (player.heldItem == this) {
                    this.direction = player.direction;
                }
                if (player.heldItem == this && player.dy > 0 && player.standingOn.length == 0 && jumpHeld) {
                    this.isRocketing = true;
                    this.canHangFrom = true;
                    this.canBeHeld = false;
                    audioHandler.PlaySound("rocket", false);
                }
                else {
                    this.ApplyInertia();
                    this.ApplyGravity();
                    this.ReactToPlatformsAndSolids();
                }
            }
        }
        this.ReactToWater();
        this.MoveByVelocity();
    };
    Rocket.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["rocket"][0][0],
            xFlip: this.direction == -1,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    };
    return Rocket;
}(Sprite));

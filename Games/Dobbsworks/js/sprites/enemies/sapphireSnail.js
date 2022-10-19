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
var SapphireSnail = /** @class */ (function (_super) {
    __extends(SapphireSnail, _super);
    function SapphireSnail() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.frame = 0;
        _this.wasPlayerOnLastFrame = false;
        return _this;
    }
    SapphireSnail.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.ApplyInertia();
        this.ReactToWater();
        var speed = 0.2;
        this.dx = speed * this.direction;
        this.frame++;
        if (this.stackedOn) {
            // don't change velocity based on player
            this.ApplyGravity();
        }
        else {
            var playerStandingOn = player && player.parentSprite == this;
            if (playerStandingOn) {
                this.frame += 1;
                if (!this.wasPlayerOnLastFrame) {
                    this.dy = 0.4;
                }
                this.dy -= 0.01;
                if (this.dy < -0.2)
                    this.dy = -0.2;
            }
            else {
                if (this.dy > 0) {
                    this.dy -= 0.02;
                    if (this.dy < 0)
                        this.dy = 0;
                }
                else if (this.dy < 0) {
                    this.dy += 0.01;
                    if (this.dy > 0)
                        this.dy = 0;
                }
            }
            this.wasPlayerOnLastFrame = playerStandingOn;
        }
    };
    SapphireSnail.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.frame / 10) % 2;
        return {
            imageTile: tiles["sapphireSnail"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    };
    return SapphireSnail;
}(Enemy));

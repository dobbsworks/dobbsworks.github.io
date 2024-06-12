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
var Yufo = /** @class */ (function (_super) {
    __extends(Yufo, _super);
    function Yufo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 16;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.zIndex = 1;
        _this.frameRow = 0;
        _this.numParkedFrames = 180;
        _this.numTravelFrames = 240;
        _this.numFlippingFrames = 60;
        _this.numFlippedFrames = 240;
        _this.stateTimer = 60;
        _this.state = "travel";
        return _this;
    }
    Yufo.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.touchedLeftWalls.length)
            this.direction = 1;
        if (this.touchedRightWalls.length)
            this.direction = -1;
        this.dy *= 0.94;
        if (this.stateTimer <= 0) {
            // move to next state
            if (this.state == "travel") {
                this.state = "park";
                this.stateTimer = this.numParkedFrames;
                this.frameRow = 0;
            }
            else if (this.state == "park") {
                this.state = "travel";
                this.stateTimer = this.numTravelFrames;
                this.frameRow = 1;
            }
            else if (this.state == "flipping") {
                this.state = "flipped";
                this.stateTimer = this.numFlippedFrames;
                this.frameRow = 2;
            }
            else if (this.state == "flipped") {
                this.state = "travel";
                this.stateTimer = this.numTravelFrames;
                this.frameRow = 0;
            }
        }
        else {
            this.stateTimer--;
            // behavior in each state
            if (this.state == "travel") {
                this.dx = this.direction * 0.75;
                if (this.stateTimer < 60) {
                    this.frameRow = Math.floor(this.stateTimer / 5) % 2 == 0 ? 1 : 2;
                }
            }
            else if (this.state == "park") {
                this.dx = 0;
                if (this.stateTimer < 60) {
                    this.frameRow = Math.floor(this.stateTimer / 5) % 2 == 0 ? 0 : 2;
                }
                if (this.stateTimer == 60) {
                    // pew pew!
                    var laser = new YufoLaser(this.xMid - 1, this.yBottom, this.layer, []);
                    this.layer.sprites.push(laser);
                }
            }
            else if (this.state == "flipping") {
                this.dx *= 0.96;
            }
            else if (this.state == "flipped") {
                this.dx = 0;
                if (this.stateTimer < 60) {
                    this.frameRow = Math.floor(this.stateTimer / 5) % 2 == 0 ? 1 : 2;
                }
            }
        }
        this.ReactToVerticalWind();
    };
    Yufo.prototype.OnBounce = function () {
        if (this.state == "flipped" && player) {
            player.forcedJumpTimer = 28;
            player.dy = -3.8;
            player.jumpTimer = -1;
            player.coyoteTimer = 0;
            this.stateTimer = this.numFlippedFrames;
        }
        else if (this.state == "flipping") {
            // keep on keeping on
        }
        else {
            this.state = "flipping";
            this.stateTimer = this.numFlippingFrames;
        }
    };
    Yufo.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.state == "flipping") {
            col = 6 - Math.floor(this.stateTimer / this.numFlippingFrames * 6);
        }
        if (this.state == "flipped") {
            col = 6;
            if (this.stateTimer < 60) {
                col = Math.floor(this.stateTimer / 10);
            }
        }
        return {
            imageTile: tiles["ufo"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 6
        };
    };
    return Yufo;
}(Enemy));
var YufoLaser = /** @class */ (function (_super) {
    __extends(YufoLaser, _super);
    function YufoLaser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 2;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        return _this;
    }
    YufoLaser.prototype.Update = function () {
        this.dy = 2;
        if (this.standingOn.length > 0 || this.parentSprite) {
            this.isActive = false;
        }
        var umbrellas = this.layer.sprites.filter(function (a) { return a instanceof Umbrella; });
        for (var _i = 0, umbrellas_1 = umbrellas; _i < umbrellas_1.length; _i++) {
            var umbrella = umbrellas_1[_i];
            if (this.Overlaps(umbrella)) {
                this.isActive = false;
                return;
            }
        }
    };
    YufoLaser.prototype.GetFrameData = function (frameNum) {
        var row = Math.floor(frameNum / 3) % 3;
        return {
            imageTile: tiles["ufo"][7][row],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 7,
            yOffset: 0
        };
    };
    return YufoLaser;
}(Enemy));

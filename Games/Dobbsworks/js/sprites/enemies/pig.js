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
var Piggle = /** @class */ (function (_super) {
    __extends(Piggle, _super);
    function Piggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.squishTimer = 0;
        _this.imageSource = "pig";
        _this.animationSpeed = 0.2;
        _this.frameRow = 0;
        _this.turnAtLedges = true;
        _this.bounceSoundId = "oink";
        return _this;
    }
    Piggle.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            this.Patrol(0.3, this.turnAtLedges);
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    };
    Piggle.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
    };
    Piggle.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 1, 0, 3, 4, 4, 3];
        var frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        if (this.isInDeathAnimation)
            frame = 5;
        return {
            imageTile: tiles[this.imageSource][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 3
        };
    };
    return Piggle;
}(Enemy));
var Hoggle = /** @class */ (function (_super) {
    __extends(Hoggle, _super);
    function Hoggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animationSpeed = 0.3;
        _this.frameRow = 1;
        return _this;
    }
    Hoggle.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (player && this.WaitForOnScreen()) {
                this.direction = (player.xMid < this.xMid ? -1 : 1);
                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.dx = 0.8;
                    this.dy = -0.7;
                }
                if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.dx = -0.8;
                    this.dy = -0.7;
                }
                this.dx += this.direction * 0.015;
                var maxSpeed = 1;
                if (Math.abs(this.dx) > maxSpeed) {
                    this.dx = this.direction * maxSpeed;
                }
            }
            this.ApplyGravity();
            this.ReactToWater();
        }
    };
    return Hoggle;
}(Piggle));

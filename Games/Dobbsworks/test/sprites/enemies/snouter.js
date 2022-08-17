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
var Snouter = /** @class */ (function (_super) {
    __extends(Snouter, _super);
    function Snouter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 15;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.ammo = SnouterBullet;
        _this.squishTimer = 0;
        _this.shootTimer = 0;
        _this.startShootingTimer = 180;
        _this.endShootingTimer = 210;
        _this.animationSpeed = 0.2;
        _this.frameCol = 0;
        _this.turnAtLedges = true;
        return _this;
    }
    Snouter.prototype.Update = function () {
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            this.shootTimer++;
            if (this.shootTimer > this.startShootingTimer) {
                if (this.shootTimer > this.endShootingTimer) {
                    this.shootTimer = 0;
                    var bullet = new this.ammo(this.x + this.direction * 10, this.y, this.layer, []);
                    bullet.dx = this.direction * 1;
                    this.layer.sprites.push(bullet);
                }
            }
            else {
                this.Patrol(0.3, this.turnAtLedges);
            }
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    };
    Snouter.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
    };
    Snouter.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1];
        if (this.shootTimer > this.startShootingTimer) {
            frames = [2, 3];
        }
        var frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        if (this.isInDeathAnimation)
            frame = 4;
        return {
            imageTile: tiles["snouter"][this.frameCol][frame],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    };
    return Snouter;
}(Enemy));

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
var Shrubbert = /** @class */ (function (_super) {
    __extends(Shrubbert, _super);
    function Shrubbert() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.state = "normal";
        _this.isBurning = false;
        _this.stunTimer = 0;
        _this.maxStun = 32;
        _this.stunFrameRow = 3;
        _this.runFrameColStart = 0;
        _this.turnAtLedges = true;
        return _this;
    }
    Shrubbert.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.state == "stunned") {
            this.stunTimer++;
            this.dx = 0;
            if (this.stunTimer >= this.maxStun) {
                this.state = "running";
            }
        }
        else {
            var speed = this.state == "normal" ? 0.3 : 0.6;
            if (this.stackedOn)
                speed = 0.3;
            if (this.isBurning)
                speed = 0.8;
            this.GroundPatrol(speed, this.turnAtLedges);
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        if (this.isInWater || this.isInWaterfall) {
            this.Extinguish();
        }
        this.canBeBouncedOn = !this.isBurning;
    };
    Shrubbert.prototype.Extinguish = function () {
        if (this.isBurning) {
            this.isBurning = false;
            this.state = "stunned";
            this.stunTimer = 0;
            this.height -= 4;
            this.y += 4;
        }
    };
    Shrubbert.prototype.OnStandInFire = function () {
        this.isBurning = true;
        if (this.height == 8) {
            this.height += 4;
            this.y -= 4;
        }
    };
    Shrubbert.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Shrubbert.prototype.OnBounce = function () {
        if (this.state == "normal") {
            this.state = "stunned";
            this.height -= 4;
            this.y += 4;
        }
        else {
            this.isActive = false;
            var deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
            this.OnDead();
        }
    };
    Shrubbert.prototype.GetFrameData = function (frameNum) {
        var frameRow = 0;
        if (this.state == "stunned")
            frameRow = this.stunFrameRow;
        if (this.state == "running")
            frameRow = 1;
        var framesPerTile = this.state == "normal" ? 5 : 3;
        var frame = Math.floor(frameNum / framesPerTile) % 4 + this.runFrameColStart;
        if (this.state == "stunned") {
            frame = Math.floor(this.stunTimer / (this.maxStun / 8)) % 8;
        }
        if (this.isBurning) {
            return {
                imageTile: tiles["burningShrubbert"][frame % 4][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: 5,
                yOffset: 4
            };
        }
        return {
            imageTile: tiles["shrub"][frame][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: this.state == "normal" ? 0 : 4
        };
    };
    return Shrubbert;
}(Enemy));
var OrangeShrubbert = /** @class */ (function (_super) {
    __extends(OrangeShrubbert, _super);
    function OrangeShrubbert() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stunFrameRow = 5;
        _this.runFrameColStart = 4;
        _this.turnAtLedges = false;
        return _this;
    }
    return OrangeShrubbert;
}(Shrubbert));

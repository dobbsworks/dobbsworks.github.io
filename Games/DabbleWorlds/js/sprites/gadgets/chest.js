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
var Chest = /** @class */ (function (_super) {
    __extends(Chest, _super);
    function Chest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = false;
        _this.isInThrowMode = false;
        _this.isBreaking = false;
        _this.contents = Key;
        _this.breakTimer = 0;
        _this.maxBreakTime = 20;
        return _this;
    }
    Chest.prototype.Update = function () {
        var _this = this;
        if (!this.isBreaking) {
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
            var key = this.layer.sprites.find(function (a) { return a instanceof Key && a.IsGoingToOverlapSprite(_this); });
            if (key) {
                key.Disappear();
                this.isBreaking = true;
            }
        }
        if (this.isBreaking) {
            if (this.breakTimer == 0) {
                var newSprite = new this.contents(this.x, this.y, this.layer, []);
                this.layer.sprites.push(newSprite);
                newSprite.GentlyEjectFromSolids();
            }
            this.breakTimer++;
            if (this.breakTimer >= this.maxBreakTime) {
                this.isActive = false;
            }
        }
    };
    Chest.prototype.GetFrameData = function (frameNum) {
        var frame = 0;
        if (this.breakTimer) {
            var time = Math.min(this.maxBreakTime, this.breakTimer);
            frame = Math.ceil(5 * time / this.maxBreakTime);
        }
        return {
            imageTile: tiles["chest"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    };
    Chest.prototype.OnThrow = function (thrower, direction) {
        this.isInThrowMode = true;
        _super.prototype.OnThrow.call(this, thrower, direction);
    };
    Chest.prototype.OnUpThrow = function (thrower, direction) {
        this.isInThrowMode = true;
        _super.prototype.OnUpThrow.call(this, thrower, direction);
    };
    return Chest;
}(Sprite));

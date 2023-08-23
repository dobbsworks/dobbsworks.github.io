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
var GunPickup = /** @class */ (function (_super) {
    __extends(GunPickup, _super);
    function GunPickup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        _this.anchor = null;
        _this.isExemptFromSilhoutte = true;
        return _this;
    }
    GunPickup.prototype.Update = function () {
        this.ApplyInertia();
        this.MoveByVelocity();
        if (player && player.Overlaps(this)) {
            audioHandler.PlaySound("gun-up", false);
            this.isActive = false;
            player.heldItem = null;
            player.hasGun = true;
        }
    };
    GunPickup.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 4) % 16;
        if (col >= 8)
            col = 0;
        return {
            imageTile: tiles["gunPickup"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: Math.sin(frameNum / 40)
        };
    };
    return GunPickup;
}(Sprite));
var GunDropped = /** @class */ (function (_super) {
    __extends(GunDropped, _super);
    function GunDropped() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        return _this;
    }
    GunDropped.prototype.Update = function () {
        this.ApplyGravity();
        this.MoveByVelocity();
        if (!this.IsOnScreen()) {
            this.isActive = false;
        }
    };
    GunDropped.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 4) % 2;
        if (frame == 0) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["gunPickup"][0][0],
            xFlip: false,
            yFlip: true,
            xOffset: 0,
            yOffset: 0
        };
    };
    return GunDropped;
}(Sprite));

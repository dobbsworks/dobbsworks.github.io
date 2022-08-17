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
var Pumpkin = /** @class */ (function (_super) {
    __extends(Pumpkin, _super);
    function Pumpkin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.rolls = false;
        _this.canBeHeld = true;
        _this.floatsInWater = true;
        _this.isPlatform = true;
        _this.hurtsEnemies = true;
        _this.breakTimer = 0;
        return _this;
    }
    Pumpkin.prototype.OnThrow = function (thrower, direction) {
        _super.prototype.OnThrow.call(this, thrower, direction);
    };
    Pumpkin.prototype.OnDownThrow = function (thrower, direction) {
        _super.prototype.OnDownThrow.call(this, thrower, direction);
    };
    Pumpkin.prototype.OnUpThrow = function (thrower, direction) {
        _super.prototype.OnUpThrow.call(this, thrower, direction);
    };
    Pumpkin.prototype.Update = function () {
        if (this.breakTimer == 0) {
            var isHeld = (player && player.heldItem == this);
            this.hurtsEnemies = !isHeld;
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
            if (!isHeld && (this.isOnCeiling || this.standingOn.length || this.touchedLeftWalls.length || this.touchedRightWalls.length)) {
                this.breakTimer = 1;
                this.canBeHeld = false;
                this.hurtsEnemies = false;
            }
        }
        else {
            this.breakTimer += 4;
            if (this.breakTimer >= 75)
                this.isActive = false;
        }
    };
    Pumpkin.prototype.OnStrikeEnemy = function (enemy) {
        this.breakTimer = 1;
        this.canBeHeld = false;
        this.hurtsEnemies = false;
    };
    Pumpkin.prototype.GetFrameData = function (frameNum) {
        if (this.breakTimer == 0) {
            return {
                imageTile: tiles["pumpkin"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        var col = Math.floor(this.breakTimer / 10);
        return {
            imageTile: tiles["pumpkin"][col][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Pumpkin;
}(Sprite));

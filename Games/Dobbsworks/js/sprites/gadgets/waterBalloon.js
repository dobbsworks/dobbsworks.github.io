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
var WaterBalloon = /** @class */ (function (_super) {
    __extends(WaterBalloon, _super);
    function WaterBalloon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 5;
        _this.width = 6;
        _this.respectsSolidTiles = true;
        _this.rolls = false;
        _this.canBeHeld = true;
        _this.floatsInWater = true;
        _this.isThrown = false;
        _this.hurtsEnemies = true;
        return _this;
    }
    WaterBalloon.prototype.OnThrow = function (thrower, direction) {
        _super.prototype.OnThrow.call(this, thrower, direction);
        this.isThrown = true;
    };
    WaterBalloon.prototype.OnUpThrow = function (thrower, direction) {
        _super.prototype.OnUpThrow.call(this, thrower, direction);
        this.isThrown = true;
    };
    WaterBalloon.prototype.OnPickup = function () {
        this.isThrown = false;
        return this;
    };
    WaterBalloon.prototype.OnStrikeEnemy = function (enemy) {
        this.Explode();
    };
    WaterBalloon.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (this.isThrown) {
            if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0 || this.isOnGround) {
                this.Explode();
            }
        }
    };
    WaterBalloon.prototype.Explode = function () {
        this.isActive = false;
        // create explosions
        audioHandler.PlaySound("splash", false);
        var speed = 1;
        for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 4) {
            var poof = new WaterBalloonSplash(this.x - 1, this.y - 1, this.layer, []);
            this.layer.sprites.push(poof);
            poof.dx = speed * Math.cos(theta);
            poof.dy = speed * Math.sin(theta);
            poof.x += poof.dx * 4;
            poof.y += poof.dy * 4;
        }
    };
    WaterBalloon.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["waterBalloon"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 3
        };
    };
    return WaterBalloon;
}(Sprite));
var WaterBalloonSplash = /** @class */ (function (_super) {
    __extends(WaterBalloonSplash, _super);
    function WaterBalloonSplash() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        return _this;
    }
    WaterBalloonSplash.prototype.Update = function () {
        var _this = this;
        this.MoveByVelocity();
        this.ApplyGravity();
        var velocityDampen = 0.96;
        this.dx *= velocityDampen;
        this.dy *= velocityDampen;
        if (this.age > 25)
            this.isActive = false;
        var overlapSprites = this.layer.sprites.filter(function (a) { return !(a instanceof WaterBalloonSplash) && a.Overlaps(_this); });
        for (var _i = 0, overlapSprites_1 = overlapSprites; _i < overlapSprites_1.length; _i++) {
            var sprite = overlapSprites_1[_i];
            if (sprite instanceof Shrubbert && sprite.isBurning) {
                sprite.Extinguish();
            }
            if (sprite instanceof RubySnail) {
                sprite.ReplaceWithSpriteType(Snail);
            }
            if (sprite instanceof SpicyJelly) {
                sprite.ReplaceWithSpriteType(LittleJelly);
            }
            if (sprite instanceof Bomb && sprite.isIgnited) {
                sprite.ResetFuse();
                sprite.isIgnited = false;
            }
        }
        this.layer.ClearTile(Math.floor(this.xMid / 12), Math.floor(this.yMid / 12));
    };
    WaterBalloonSplash.prototype.GetFrameData = function (frameNum) {
        var col = [0, 1, 1, 2, 2, 2, 3, 3, -1, 3, -1, 3, -1][Math.floor(this.age / 2)];
        if (col == -1) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["water"][col][2],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return WaterBalloonSplash;
}(Sprite));

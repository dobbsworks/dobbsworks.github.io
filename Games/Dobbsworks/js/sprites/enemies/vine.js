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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Vinedicator = /** @class */ (function (_super) {
    __extends(Vinedicator, _super);
    function Vinedicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.canSpinBounceOn = true;
        _this.hitTimer = 0;
        _this.shootTimer = 0;
        _this.baseSpeed = 1;
        _this.colOffset = 0;
        _this.OnHitByProjectile = function (enemy, projectile) {
            enemy.hitTimer = 60;
            projectile.isActive = false;
            audioHandler.PlaySound("plink", true);
        };
        return _this;
    }
    Vinedicator.prototype.Update = function () {
        var _a;
        if (player) {
            this.direction = player.x < this.x ? -1 : 1;
            var playerDistance = Math.abs(this.xMid - player.xMid);
            if (playerDistance < 12 * 8) {
                this.shootTimer++;
                if (this.shootTimer > 180) {
                    // shoot
                    var bullet = new VineProjectile(this.xMid - 3 + this.direction * 6, this.y + 4, this.layer, []);
                    bullet.colOffset = this.colOffset;
                    bullet.dx = this.direction * 0.5;
                    this.layer.sprites.push(bullet);
                    this.shootTimer = 0;
                    audioHandler.PlaySound("stuck-jump", false);
                }
            }
            else {
                this.shootTimer = 0;
            }
            var verticalDistance = player.y - this.y;
            var isHeadInWater = ((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.waterLayer.GetTileByPixel(this.xMid, this.y + 6 + this.floatingPointOffset).tileType.isSwimmable) || false;
            var vineSpeed = (isHeadInWater ? 0.5 : 1) * this.baseSpeed;
            if (this.hitTimer > 0) {
                this.hitTimer--;
                vineSpeed *= 0.5;
                this.shootTimer = 0;
            }
            if (verticalDistance > 0.5 || this.hitTimer > 0) {
                if (this.height > 10) {
                    this.y += vineSpeed;
                    this.height -= vineSpeed;
                }
            }
            else if (verticalDistance < -0.5) {
                var solidHeight = this.GetHeightOfSolid(0, -1);
                if (solidHeight.yPixel < this.y - 1) {
                    this.y -= vineSpeed;
                    this.height += vineSpeed;
                }
            }
        }
        this.ApplyGravity();
        this.ApplyInertia();
    };
    Vinedicator.prototype.GetFrameData = function (frameNum) {
        var headFrame = Math.floor(frameNum / 12) % 4;
        if (headFrame == 3)
            headFrame = 1;
        var row = this.shootTimer > 120 ? 1 : 0;
        var head = {
            imageTile: tiles["vine"][headFrame + this.colOffset][row],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 1
        };
        if (!this.IsOnScreen())
            return [head];
        var stemBase = {
            imageTile: tiles["vine"][3 + this.colOffset][2],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 12 - this.height
        };
        var stems = [];
        for (var y = 24; y <= this.height; y += 12) {
            var row_1 = y % 24 == 0 ? 1 : 0;
            var xFlip = Math.floor(y / 24) % 2 == 0;
            stems.push({
                imageTile: tiles["vine"][3 + this.colOffset][row_1],
                xFlip: xFlip,
                yFlip: false,
                xOffset: 2,
                yOffset: y - this.height
            });
        }
        return __spreadArrays([stemBase], stems, [head]);
    };
    return Vinedicator;
}(Enemy));
var GrayGrowth = /** @class */ (function (_super) {
    __extends(GrayGrowth, _super);
    function GrayGrowth() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.baseSpeed = 0.5;
        _this.colOffset = 4;
        return _this;
    }
    return GrayGrowth;
}(Vinedicator));
var VineProjectile = /** @class */ (function (_super) {
    __extends(VineProjectile, _super);
    function VineProjectile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 4;
        _this.respectsSolidTiles = true;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.canBeBouncedOn = true;
        _this.colOffset = 0;
        return _this;
    }
    VineProjectile.prototype.Update = function () {
        if (this.isTouchingLeftWall || this.isTouchingRightWall || this.isOnCeiling || this.standingOn.length) {
            this.ReplaceWithSpriteType(Poof);
        }
        this.ReactToVerticalWind();
    };
    VineProjectile.prototype.OnBounce = function () {
        this.ReplaceWithSpriteType(Poof);
        this.OnDead();
    };
    VineProjectile.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["vine"][col + this.colOffset][2],
            xFlip: false,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        };
    };
    return VineProjectile;
}(Enemy));

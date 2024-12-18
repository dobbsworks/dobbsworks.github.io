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
var LittleJelly = /** @class */ (function (_super) {
    __extends(LittleJelly, _super);
    function LittleJelly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 13;
        _this.respectsSolidTiles = true;
        _this.squishTimer = 0;
        _this.jumpPrepTimer = 0;
        _this.canBeBouncedOn = true;
        _this.frameCounter = 0;
        _this.animateTimer = 0;
        _this.wasOnGround = false;
        _this.rowNumber = 0;
        _this.landingCoating = TileType.Slime;
        _this.numberOfGroundFrames = 20;
        return _this;
    }
    LittleJelly.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            if (this.squishTimer == 2)
                audioHandler.PlaySound("stuck-jump", true);
            this.squishTimer++;
            this.ApplyGravity();
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (this.isOnGround) {
                if (!this.wasOnGround) {
                    // just landed
                    this.OnGroundLanding();
                    this.animateTimer = 1;
                }
                this.jumpPrepTimer++;
                this.dx *= 0.5;
                this.WhileOnGround();
                if (this.jumpPrepTimer > this.numberOfGroundFrames) {
                    this.jumpPrepTimer = 0;
                    this.dy = -2.5;
                    this.parentSprite = null;
                    this.OnJump();
                }
                this.wasOnGround = true;
                if (player) {
                    if (player.xMid < this.xMid)
                        this.direction = -1;
                    if (player.xMid > this.xMid)
                        this.direction = 1;
                }
            }
            else {
                this.SkyPatrol(0.35);
                this.wasOnGround = false;
            }
            this.ApplyGravity();
            this.ReactToWater();
        }
        if (this.animateTimer > 0) {
            this.animateTimer++;
            this.frameCounter += 0.4;
            if (this.animateTimer > 20) {
                this.animateTimer = 0;
                this.frameCounter = 0;
            }
        }
    };
    LittleJelly.prototype.OnJump = function () { };
    LittleJelly.prototype.WhileOnGround = function () { };
    LittleJelly.prototype.OnGroundLanding = function () {
        audioHandler.PlaySound("stuck-jump", true);
        this.CreateSlimeGround(this.landingCoating);
    };
    LittleJelly.prototype.CreateSlimeGround = function (slimeGround) {
        var _this = this;
        var xs = [this.xMid, this.xMid - 6, this.xMid + 6].map(function (a) { return Math.floor(a / _this.layer.tileWidth); }).filter(Utility.OnlyUnique);
        var y = Math.floor((this.yBottom + 1) / this.layer.tileHeight);
        xs.forEach(function (x) { return _this.AttemptToSlime(x, y, slimeGround); });
    };
    LittleJelly.prototype.AttemptToSlime = function (xIndex, yIndex, slimeGround) {
        this.layer.AttemptToCoatTile(xIndex, yIndex, slimeGround);
    };
    LittleJelly.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
        if (player)
            player.isSpinJumping = false;
    };
    LittleJelly.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 3, 4, 3, 2, 1];
        var frame = frames[Math.floor(this.frameCounter) % frames.length];
        if (this.isInDeathAnimation) {
            frame = Math.floor(this.squishTimer / 5) + 5;
            if (frame > 9)
                frame = 9;
        }
        return {
            imageTile: tiles["slime"][frame][this.rowNumber],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    };
    return LittleJelly;
}(Enemy));
var ChillyJelly = /** @class */ (function (_super) {
    __extends(ChillyJelly, _super);
    function ChillyJelly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.numberOfGroundFrames = 150;
        _this.rowNumber = 1;
        _this.effectType = FrostEffect;
        _this.landingCoating = TileType.IceTop;
        return _this;
    }
    ChillyJelly.prototype.OnJump = function () {
        var _this = this;
        var frost = this.layer.sprites.filter(function (a) { return a instanceof _this.effectType && a.targetSprite == _this; });
        if (frost.length == 0) {
            var frostSprite = new this.effectType(this.x, this.y, this.layer, []);
            frostSprite.targetSprite = this;
            this.layer.sprites.push(frostSprite);
        }
    };
    ChillyJelly.prototype.OnGroundLanding = function () {
        var _this = this;
        _super.prototype.OnGroundLanding.call(this);
        var frost = this.layer.sprites.filter(function (a) { return a instanceof _this.effectType && a.targetSprite == _this; });
        for (var _i = 0, frost_1 = frost; _i < frost_1.length; _i++) {
            var f = frost_1[_i];
            f.isActive = false;
        }
    };
    ChillyJelly.prototype.OnStandInFire = function () {
        this.OnBounce();
    };
    return ChillyJelly;
}(LittleJelly));
var FrostEffect = /** @class */ (function (_super) {
    __extends(FrostEffect, _super);
    function FrostEffect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 18;
        _this.width = 25;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.respectsSolidTiles = false;
        _this.imageSource = "frostEffect";
        _this.timer = 0;
        _this.targetSprite = null;
        return _this;
    }
    FrostEffect.prototype.Update = function () {
        if (this.targetSprite) {
            this.x = this.targetSprite.xMid - this.width / 2;
            this.y = this.targetSprite.yMid - this.height / 2;
            if (!this.targetSprite.isActive)
                this.isActive = false;
        }
        else {
            this.timer++;
            this.ApplyInertia();
            if (this.timer > 60) {
                this.isActive = false;
            }
        }
    };
    FrostEffect.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles[this.imageSource][Math.floor(frameNum / 5) % 8][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 3
        };
    };
    return FrostEffect;
}(Enemy));
var FlameEffect = /** @class */ (function (_super) {
    __extends(FlameEffect, _super);
    function FlameEffect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageSource = "flameEffect";
        _this.landingCoating = TileType.FireTop;
        return _this;
    }
    return FlameEffect;
}(FrostEffect));
var SpicyJelly = /** @class */ (function (_super) {
    __extends(SpicyJelly, _super);
    function SpicyJelly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.numberOfGroundFrames = 150;
        _this.rowNumber = 2;
        _this.landingCoating = TileType.FireTopDecay1;
        _this.effectType = FlameEffect;
        return _this;
    }
    SpicyJelly.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.isInWater) {
            this.ReplaceWithSpriteType(LittleJelly);
        }
    };
    SpicyJelly.prototype.OnStandInFire = function () { };
    return SpicyJelly;
}(ChillyJelly));

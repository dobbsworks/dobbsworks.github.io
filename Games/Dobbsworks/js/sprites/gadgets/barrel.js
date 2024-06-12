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
var Barrel = /** @class */ (function (_super) {
    __extends(Barrel, _super);
    function Barrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = true;
        _this.floatsInWater = true;
        _this.isPlatform = true;
        _this.hurtsEnemies = false;
        _this.frameRow = 0;
        _this.rollingBarrelType = RollingBarrel;
        return _this;
    }
    Barrel.prototype.OnThrow = function (thrower, direction) {
        _super.prototype.OnThrow.call(this, thrower, direction);
        this.ReplaceWithRollingBarrel();
    };
    Barrel.prototype.OnDownThrow = function (thrower, direction) {
        _super.prototype.OnDownThrow.call(this, thrower, direction);
        this.ReplaceWithRollingBarrel();
    };
    Barrel.prototype.OnUpThrow = function (thrower, direction) {
        _super.prototype.OnUpThrow.call(this, thrower, direction);
        this.ReplaceWithRollingBarrel();
    };
    Barrel.prototype.ReplaceWithRollingBarrel = function () {
        this.ReplaceWithSpriteType(this.rollingBarrelType);
    };
    Barrel.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Barrel.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["barrel"][0][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Barrel;
}(Sprite));
var RollingBarrel = /** @class */ (function (_super) {
    __extends(RollingBarrel, _super);
    function RollingBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = true;
        _this.floatsInWater = true;
        _this.isPlatform = true;
        _this.hurtsEnemies = true;
        _this.frameRow = 1;
        return _this;
    }
    RollingBarrel.prototype.OnStrikeEnemy = function (enemy) {
        this.Break();
    };
    RollingBarrel.prototype.Break = function () {
        var breakingAnimation = new BreakingBarrel(this.x, this.y, this.layer, []);
        this.isActive = false;
        this.layer.sprites.push(breakingAnimation);
    };
    RollingBarrel.prototype.OnPickup = function () {
        return this.ReplaceWithSpriteType(Barrel);
    };
    RollingBarrel.prototype.Update = function () {
        this.ApplyGravity();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        this.rotation -= this.GetTotalDx() / 2;
        if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0) {
            this.Break();
        }
        else if (this.isInWater) {
            this.Float();
        }
    };
    RollingBarrel.prototype.Float = function () {
        this.ReplaceWithSpriteType(Barrel);
    };
    RollingBarrel.prototype.GetFrameData = function (frameNum) {
        var totalFrames = 4;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = Math.floor(rot / (Math.PI * 2) * totalFrames) || 1;
        if (frame < 0)
            frame = 0;
        return {
            imageTile: tiles["barrel"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return RollingBarrel;
}(Sprite));
var BreakingBarrel = /** @class */ (function (_super) {
    __extends(BreakingBarrel, _super);
    function BreakingBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        _this.frame = 0;
        _this.frameRow = 1;
        return _this;
    }
    BreakingBarrel.prototype.Update = function () {
        this.frame = Math.floor(this.age / 10);
        if (this.frame >= 4)
            this.isActive = false;
    };
    BreakingBarrel.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["barrel"][this.frame + 4][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return BreakingBarrel;
}(Sprite));
var BreakingSteelBarrel = /** @class */ (function (_super) {
    __extends(BreakingSteelBarrel, _super);
    function BreakingSteelBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 3;
        return _this;
    }
    return BreakingSteelBarrel;
}(BreakingBarrel));
var SteelBarrel = /** @class */ (function (_super) {
    __extends(SteelBarrel, _super);
    function SteelBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 2;
        _this.rollingBarrelType = RollingSteelBarrel;
        return _this;
    }
    return SteelBarrel;
}(Barrel));
var RollingSteelBarrel = /** @class */ (function (_super) {
    __extends(RollingSteelBarrel, _super);
    function RollingSteelBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 3;
        return _this;
    }
    RollingSteelBarrel.prototype.OnStrikeEnemy = function (enemy) { };
    RollingSteelBarrel.prototype.Break = function () {
        this.dx = 0;
        this.dy = -1;
        this.ReplaceWithSpriteType(SteelBarrel);
    };
    RollingSteelBarrel.prototype.Float = function () {
        this.ReplaceWithSpriteType(SteelBarrel);
    };
    RollingSteelBarrel.prototype.OnPickup = function () {
        return this.ReplaceWithSpriteType(SteelBarrel);
    };
    return RollingSteelBarrel;
}(RollingBarrel));
var EmptyBarrel = /** @class */ (function (_super) {
    __extends(EmptyBarrel, _super);
    function EmptyBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.blocksDamage = true;
        _this.holdRatio = 0; // 0 held high, 1 held over player
        _this.frameCol = 0;
        _this.blockType = HeldDamageBlockType.Iframe;
        _this.breakSprite = BreakingBarrel;
        return _this;
    }
    EmptyBarrel.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (player) {
            if (player.heldItem == this) {
                if (player.isOnGround) {
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                        this.holdRatio = Utility.Approach(this.holdRatio, 1.0, 0.1);
                    }
                    else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                        this.holdRatio = Utility.Approach(this.holdRatio, 0.0, 0.1);
                    }
                    else {
                        this.holdRatio = Utility.Approach(this.holdRatio, 0.8, 0.1);
                    }
                }
                else {
                    this.holdRatio = Utility.Approach(this.holdRatio, 0.8, 0.1);
                }
                if (this.holdRatio > 0.5)
                    player.dx *= 0.9;
            }
            else {
                this.holdRatio = 0;
            }
        }
        else {
            this.holdRatio = 0;
        }
    };
    EmptyBarrel.prototype.OnHolderTakeDamage = function () {
        if (this.holdRatio == 1) {
            return HeldDamageBlockType.Invincible;
        }
        else if (this.holdRatio > 0.5) {
            this.ReplaceWithSpriteType(this.breakSprite);
            return HeldDamageBlockType.Iframe;
        }
        return HeldDamageBlockType.Vulnerable;
    };
    EmptyBarrel.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["barrel"][this.frameCol][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: this.holdRatio * -9
        };
    };
    return EmptyBarrel;
}(Sprite));
var EmptySteelBarrel = /** @class */ (function (_super) {
    __extends(EmptySteelBarrel, _super);
    function EmptySteelBarrel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameCol = 1;
        _this.breakSprite = BreakingSteelBarrel;
        return _this;
    }
    return EmptySteelBarrel;
}(EmptyBarrel));

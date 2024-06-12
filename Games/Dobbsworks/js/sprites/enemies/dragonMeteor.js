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
var SmallMeteor = /** @class */ (function (_super) {
    __extends(SmallMeteor, _super);
    function SmallMeteor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.willCoolOff = false;
        _this.zIndex = 1;
        return _this;
    }
    SmallMeteor.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.dy *= 0.9;
        // todo fire effect
        if (this.isOnGround && this.age > 1) {
            this.dy = -1;
            if (this.willCoolOff) {
                this.ReplaceWithSpriteType(GrabbableMeteor);
            }
            else {
                this.dx = 0;
                this.dy = 0;
                this.ReplaceWithSpriteType(BrokenMeteor);
            }
        }
        if (this.age % 10 == 0) {
            var fireX = this.x + Math.random() * this.width - 3;
            var fireY = this.y + Math.random() * this.height - 3;
            var fire = new SingleFireBreath(fireX, fireY, this.layer, []);
            fire.hurtsPlayer = false;
            this.layer.sprites.push(fire);
        }
    };
    SmallMeteor.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(Math.sin(this.x) * 10) % 2 == 0 ? 1 : 2;
        var xFlip = Math.floor(Math.sin(this.x) * 10 + Math.floor(frameNum / 10)) % 2 == 0;
        var yFlip = Math.floor(Math.cos(this.x) * 10 + Math.floor(frameNum / 10)) % 2 == 0;
        return {
            imageTile: tiles["smallMeteor"][frame][0],
            xFlip: xFlip,
            yFlip: yFlip,
            xOffset: 1,
            yOffset: 1
        };
    };
    return SmallMeteor;
}(Enemy));
var GrabbableMeteor = /** @class */ (function (_super) {
    __extends(GrabbableMeteor, _super);
    function GrabbableMeteor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        return _this;
    }
    GrabbableMeteor.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    GrabbableMeteor.prototype.OnThrow = function (thrower, direction) {
        _super.prototype.OnThrow.call(this, thrower, direction);
        this.ReplaceWithSpriteType(ThrownMeteor);
    };
    GrabbableMeteor.prototype.OnDownThrow = function (thrower, direction) {
        _super.prototype.OnDownThrow.call(this, thrower, direction);
        this.ReplaceWithSpriteType(ThrownMeteor);
    };
    GrabbableMeteor.prototype.OnUpThrow = function (thrower, direction) {
        _super.prototype.OnUpThrow.call(this, thrower, direction);
        this.ReplaceWithSpriteType(ThrownMeteor);
    };
    GrabbableMeteor.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["smallMeteor"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return GrabbableMeteor;
}(Sprite));
var ThrownMeteor = /** @class */ (function (_super) {
    __extends(ThrownMeteor, _super);
    function ThrownMeteor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.hurtsEnemies = true;
        return _this;
    }
    ThrownMeteor.prototype.OnStrikeEnemy = function (enemy) {
        this.ReplaceWithSpriteType(BrokenMeteor);
    };
    ThrownMeteor.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (this.isOnGround || this.isOnCeiling || this.isTouchingLeftWall || this.isTouchingRightWall) {
            this.dx = 0;
            this.dy = 0;
            this.ReplaceWithSpriteType(BrokenMeteor);
        }
    };
    ThrownMeteor.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["smallMeteor"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return ThrownMeteor;
}(Sprite));
var BrokenMeteor = /** @class */ (function (_super) {
    __extends(BrokenMeteor, _super);
    function BrokenMeteor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        return _this;
    }
    BrokenMeteor.prototype.Update = function () {
        this.ApplyGravity();
        this.MoveByVelocity();
    };
    BrokenMeteor.prototype.GetFrameData = function (frameNum) {
        if (Math.floor(frameNum / 2) % 2 == 0) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 1,
                yOffset: 1
            };
        }
        return {
            imageTile: tiles["smallMeteor"][3][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return BrokenMeteor;
}(Sprite));
// falls, on land bounce, change to throwable
// on throw, change to break on solid

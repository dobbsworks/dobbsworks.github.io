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
var Piggle = /** @class */ (function (_super) {
    __extends(Piggle, _super);
    function Piggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.squishTimer = 0;
        _this.imageSource = "pig";
        _this.animationSpeed = 0.2;
        _this.frameRow = (SeasonalService.GetEvent() == SeasonalEvent.Halloween) ? 2 : 0;
        _this.turnAtLedges = true;
        _this.bounceSoundId = "oink";
        return _this;
    }
    Piggle.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            this.dx = 0;
            this.dy = 0;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            this.GroundPatrol(0.3, this.turnAtLedges);
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    };
    Piggle.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Piggle.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
    };
    Piggle.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 1, 0, 3, 4, 4, 3];
        var frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        if (this.isInDeathAnimation)
            frame = 5;
        return {
            imageTile: tiles[this.imageSource][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 3
        };
    };
    return Piggle;
}(Enemy));
var PogoPiggle = /** @class */ (function (_super) {
    __extends(PogoPiggle, _super);
    function PogoPiggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 15;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.squishTimer = 0;
        _this.pogoTimer = 0;
        _this.bounceSoundId = "oink";
        _this.hasHelmet = true;
        _this.iFrames = 0;
        return _this;
    }
    PogoPiggle.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (this.isOnGround) {
                this.pogoTimer++;
                this.dx *= 0.9;
                if (this.pogoTimer > 10) {
                    this.pogoTimer = 0;
                    this.dy = -2.5;
                    this.parentSprite = null;
                }
            }
            if (this.iFrames > 0) {
                this.iFrames--;
                if (this.iFrames == 0)
                    this.damagesPlayer = true;
            }
            this.SkyPatrol(0.3);
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    };
    PogoPiggle.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    PogoPiggle.prototype.OnBounce = function () {
        if (this.iFrames > 0) {
            return;
        }
        if (this.hasHelmet) {
            this.hasHelmet = false;
            if (this.dy < 0)
                this.dy = 0;
            var helmet = new PogoHelmet(this.x, this.y, this.layer, []);
            helmet.dy = -1;
            this.layer.sprites.push(helmet);
            this.iFrames = 10;
            this.damagesPlayer = false;
        }
        else {
            this.canBeBouncedOn = false;
            this.isInDeathAnimation = true;
            this.dx = 0;
            this.dy = 0;
            this.OnDead();
        }
    };
    PogoPiggle.prototype.GetFrameData = function (frameNum) {
        if (this.isInDeathAnimation) {
            return {
                imageTile: tiles["pig"][5][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: 3,
                yOffset: 1
            };
        }
        var frame = this.pogoTimer > 0 ? 1 : 0;
        if (!this.hasHelmet)
            frame += 2;
        return {
            imageTile: tiles["pogo"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 1
        };
    };
    return PogoPiggle;
}(Enemy));
var PogoHelmet = /** @class */ (function (_super) {
    __extends(PogoHelmet, _super);
    function PogoHelmet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 15;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.direction = 1;
        return _this;
    }
    PogoHelmet.prototype.Update = function () {
        if (this.age > 30)
            this.isActive = false;
        this.ApplyGravity();
        this.MoveByVelocity();
    };
    PogoHelmet.prototype.GetFrameData = function (frameNum) {
        if (Math.floor(frameNum / 4) % 2 == 0) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["pogo"][4][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 1
        };
    };
    return PogoHelmet;
}(Sprite));
var Hoggle = /** @class */ (function (_super) {
    __extends(Hoggle, _super);
    function Hoggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animationSpeed = 0.3;
        _this.frameRow = 1;
        return _this;
    }
    Hoggle.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (player && this.WaitForOnScreen()) {
                this.direction = (player.xMid < this.xMid ? -1 : 1);
                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.dx = 0.8;
                    this.dy = -0.7;
                }
                if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.dx = -0.8;
                    this.dy = -0.7;
                }
                this.AccelerateHorizontally(0.015, this.direction * 1);
            }
            this.ApplyGravity();
            this.ReactToWater();
        }
    };
    return Hoggle;
}(Piggle));

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
var ExtraHitHeart = /** @class */ (function (_super) {
    __extends(ExtraHitHeart, _super);
    function ExtraHitHeart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = false;
        _this.slowFall = true;
        _this.isExemptFromSilhoutte = true;
        return _this;
    }
    ExtraHitHeart.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (player && player.Overlaps(this)) {
            audioHandler.PlaySound("heart", false);
            this.isActive = false;
            this.layer.sprites.push(new ExtraHitHeartAnimation(this.x, this.y, this.layer, []));
            var floatingHeart = new ExtraHitHeartSmall(this.x, this.y, this.layer, []);
            var latestFloatingHeart = this.layer.sprites.filter(function (a) { return a instanceof ExtraHitHeartSmall; });
            if (latestFloatingHeart.length > 0) {
                floatingHeart.parent = latestFloatingHeart[latestFloatingHeart.length - 1];
            }
            else {
                floatingHeart.parent = player;
            }
            this.layer.sprites.push(floatingHeart);
        }
    };
    ExtraHitHeart.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["heart"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ExtraHitHeart;
}(Sprite));
var ExtraHitHeartAnimation = /** @class */ (function (_super) {
    __extends(ExtraHitHeartAnimation, _super);
    function ExtraHitHeartAnimation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        return _this;
    }
    ExtraHitHeartAnimation.prototype.Update = function () {
        if (player) {
            this.x = player.xMid - this.width / 2;
            this.y = player.y - this.height - Math.max(this.age / 10, 6);
        }
        if (this.age > 60)
            this.isActive = false;
    };
    ExtraHitHeartAnimation.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.age / 3) % 3;
        return {
            imageTile: tiles["heart"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ExtraHitHeartAnimation;
}(Sprite));
var ExtraHitHeartSmall = /** @class */ (function (_super) {
    __extends(ExtraHitHeartSmall, _super);
    function ExtraHitHeartSmall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // floats around player
        _this.height = 4;
        _this.width = 5;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        _this.direction = 1;
        _this.index = 0;
        return _this;
    }
    ExtraHitHeartSmall.prototype.Update = function () {
        if (this.parent instanceof Player) {
            this.index = 1;
        }
        else {
            this.index = this.parent.index + 1;
        }
        this.direction = this.parent.direction;
        if (player) {
            var targetX = this.parent.x - this.direction * this.parent.width;
            var targetY = this.parent.y - Math.sin((player.age / 120) + this.index / 4) * 1;
            this.x += (targetX - this.x) * 0.06;
            this.y += (targetY - this.y) * 0.06;
        }
    };
    ExtraHitHeartSmall.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["heartSmall"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ExtraHitHeartSmall;
}(Sprite));
var ExtraHitHeartSmallLoss = /** @class */ (function (_super) {
    __extends(ExtraHitHeartSmallLoss, _super);
    function ExtraHitHeartSmallLoss() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 5;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        return _this;
    }
    ExtraHitHeartSmallLoss.prototype.Update = function () {
        this.y -= 0.1;
        if (this.age > 60)
            this.isActive = false;
    };
    ExtraHitHeartSmallLoss.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.age / 3) % 3;
        return {
            imageTile: tiles["heartSmall"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ExtraHitHeartSmallLoss;
}(Sprite));
var GoldHeart = /** @class */ (function (_super) {
    __extends(GoldHeart, _super);
    function GoldHeart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 11;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.isExemptFromSilhoutte = true;
        _this.isBroken = false;
        _this.brokenTimer = 0;
        return _this;
    }
    GoldHeart.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (this.isBroken) {
            this.canBeHeld = false;
            this.dx = 0;
            this.dy = -0.2;
            if (player && player.heldItem == this)
                player.heldItem = null;
            this.brokenTimer++;
            if (this.brokenTimer > 60) {
                this.dy = 0;
            }
        }
    };
    GoldHeart.prototype.GetFrameData = function (frameNum) {
        if (this.isBroken && Math.floor(frameNum / 4) % 2 == 0 && this.brokenTimer < 60) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["goldHeart"][this.isBroken ? 1 : 0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    };
    return GoldHeart;
}(Sprite));

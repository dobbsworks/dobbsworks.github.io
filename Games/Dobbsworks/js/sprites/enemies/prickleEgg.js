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
var PrickleShell = /** @class */ (function (_super) {
    __extends(PrickleShell, _super);
    function PrickleShell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.jumpTimer = 0;
        _this.frameCols = [0, 1, 2, 3, 2, 1];
        _this.frameRow = 0;
        return _this;
    }
    PrickleShell.prototype.Update = function () {
        if (this.isOnGround) {
            this.direction *= -1;
            this.dy = -1;
            this.jumpTimer = 0;
        }
        if (this.isOnCeiling) {
            this.jumpTimer = 9999;
        }
        this.jumpTimer++;
        if (this.jumpTimer > 24) {
            this.ApplyGravity();
        }
        this.ApplyInertia();
        this.ReactToWater();
    };
    PrickleShell.prototype.GetFrameData = function (frameNum) {
        var frames = this.frameCols;
        var frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle-egg"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return PrickleShell;
}(Enemy));
var PrickleEgg = /** @class */ (function (_super) {
    __extends(PrickleEgg, _super);
    function PrickleEgg() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canBeBouncedOn = true;
        _this.frameCols = [0, 1, 2, 3];
        _this.frameRow = 1;
        return _this;
    }
    PrickleEgg.prototype.OnBounce = function () {
        if (this.frameRow === 2) {
            this.Crumble();
        }
        if (this.frameRow === 1) {
            this.frameRow = 2;
        }
    };
    PrickleEgg.prototype.Crumble = function () {
        this.isActive = false;
        var crumble = new PrickleEggCrumble(this.x, this.y, this.layer, []);
        crumble.dy = this.dy;
        this.layer.sprites.push(crumble);
    };
    return PrickleEgg;
}(PrickleShell));
var PrickleEggCrumble = /** @class */ (function (_super) {
    __extends(PrickleEggCrumble, _super);
    function PrickleEggCrumble() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        return _this;
    }
    PrickleEggCrumble.prototype.Update = function () {
        if (this.age > 20)
            this.isActive = false;
    };
    PrickleEggCrumble.prototype.GetFrameData = function (frameNum) {
        var frame = Math.min(Math.floor(this.age / 5), 3);
        return {
            imageTile: tiles["prickle-egg"][frame][3],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return PrickleEggCrumble;
}(Sprite));
var PrickleRock = /** @class */ (function (_super) {
    __extends(PrickleRock, _super);
    function PrickleRock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.initialized = false;
        _this.killedByProjectiles = false;
        return _this;
    }
    PrickleRock.prototype.Update = function () {
        if (!this.initialized && player) {
            this.initialized = true;
            this.direction = player.x < this.x ? -1 : 1;
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    };
    PrickleRock.prototype.GetFrameData = function (frameNum) {
        var a = this.age % 231;
        var frame = (a != 0 && a <= 4) ? 2 : 1;
        return {
            imageTile: tiles["prickle-egg"][frame][4],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return PrickleRock;
}(Enemy));
